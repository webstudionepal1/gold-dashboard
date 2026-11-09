import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { buildPaginationMeta, getPagination } from "@/lib/pagination";
import { withMongoId } from "@/lib/serializers";
import { handleGenericDelete, parseBody, slugify } from "../crud";
import { getAuthUser } from "@/lib/auth";

function formatBlog(
  blog: Awaited<ReturnType<typeof prisma.blog.findFirst>> & object
) {
  if (!blog) return null;
  const b = blog as NonNullable<typeof blog> & {
    author: { id: string; name: string; email: string };
  };
  return {
    ...withMongoId(b),
    author: {
      _id: b.author.id,
      name: b.author.name,
      email: b.author.email,
    },
    createdBy: b.authorId,
  };
}

export async function handleBlogList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip, search, sortOrder } = getPagination(searchParams);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (featured === "true") where.isFeatured = true;

  const [blogs, totalCount] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder === "asc" ? "asc" : "desc" },
      include: { author: true },
    }),
    prisma.blog.count({ where }),
  ]);

  return apiSuccess({
    blogs: blogs.map((b) => formatBlog(b)!),
    pagination: buildPaginationMeta(totalCount, page, limit),
  });
}

export async function handleBlogGet(id: string) {
  const blog = await prisma.blog.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { author: true },
  });
  if (!blog) return apiError("Blog not found", 404);
  return apiSuccess(formatBlog(blog));
}

export async function handleBlogCreate(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("Unauthorized", 401);

  const body = await parseBody(req);
  const title = String(body.title || "");
  if (!title) return apiError("Title required", 400);

  const blog = await prisma.blog.create({
    data: {
      title,
      slug: String(body.slug || slugify(title)),
      content: String(body.content || ""),
      excerpt: body.excerpt ? String(body.excerpt) : null,
      authorId: user.id,
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      categories: Array.isArray(body.categories) ? body.categories.map(String) : [],
      featuredImage: body.featuredImage ? String(body.featuredImage) : null,
      images: Array.isArray(body.images) ? body.images.map(String) : [],
      video: body.video ? String(body.video) : null,
      status: (body.status as "draft" | "published" | "archived") || "draft",
      isFeatured: Boolean(body.isFeatured),
      metadata: body.metadata ?? {},
      publishedAt: body.status === "published" ? new Date() : null,
    },
    include: { author: true },
  });

  return apiSuccess(formatBlog(blog), "Blog created", 201);
}

export async function handleBlogUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      ...(body.title && { title: String(body.title) }),
      ...(body.content && { content: String(body.content) }),
      ...(body.status && { status: body.status as "draft" | "published" | "archived" }),
      ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
      ...(body.isActive !== undefined && {
        isActive: body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1",
      }),
    },
    include: { author: true },
  });
  return apiSuccess(formatBlog(blog));
}

export async function handleBlogDelete(id: string) {
  return handleGenericDelete("blog", id);
}

export async function handleBlogAnalytics() {
  const [total, published, draft, archived, featured, agg] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "published" } }),
    prisma.blog.count({ where: { status: "draft" } }),
    prisma.blog.count({ where: { status: "archived" } }),
    prisma.blog.count({ where: { isFeatured: true } }),
    prisma.blog.aggregate({ _sum: { views: true, likes: true } }),
  ]);

  const recentBlogs = await prisma.blog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return apiSuccess({
    overview: {
      totalBlogs: total,
      publishedBlogs: published,
      draftBlogs: draft,
      archivedBlogs: archived,
      featuredBlogs: featured,
      totalViews: agg._sum.views || 0,
      totalLikes: agg._sum.likes || 0,
    },
    recentActivity: {
      recentBlogs: recentBlogs.map((b) => formatBlog(b)!),
      topViewedBlogs: recentBlogs.map((b) => formatBlog(b)!),
      topLikedBlogs: recentBlogs.map((b) => formatBlog(b)!),
    },
  });
}
