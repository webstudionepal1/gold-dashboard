import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiError, apiPaginated, apiSuccess } from "@/lib/api-response";
import { buildPaginationMeta, getPagination } from "@/lib/pagination";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { parseBracketFormData, coerceFormValue } from "@/lib/parse-form-data";
import { parseFormDataFiles, parseJsonField } from "@/lib/upload";

type ModelName = keyof typeof prisma;

export async function handleGenericList(
  req: NextRequest,
  model: ModelName,
  searchFields: string[] = ["name"],
  include?: object
) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip, search, sortOrder } = getPagination(searchParams);

  const delegate = prisma[model] as {
    findMany: (args: object) => Promise<{ id: string }[]>;
    count: (args: object) => Promise<number>;
  };

  const where =
    search && searchFields.length
      ? {
          OR: searchFields.map((f) => ({
            [f]: { contains: search, mode: "insensitive" as const },
          })),
        }
      : {};

  const [items, totalCount] = await Promise.all([
    delegate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder },
      ...(include ? { include } : {}),
    }),
    delegate.count({ where }),
  ]);

  return apiPaginated(
    withMongoIds(items),
    buildPaginationMeta(totalCount, page, limit)
  );
}

export async function handleGenericGetById(
  model: ModelName,
  id: string,
  include?: object
) {
  const delegate = prisma[model] as {
    findUnique: (args: object) => Promise<{ id: string } | null>;
  };

  const item = await delegate.findUnique({
    where: { id },
    ...(include ? { include } : {}),
  });

  if (!item) return apiError("Not found", 404);
  return apiSuccess(withMongoId(item));
}

export async function handleGenericDelete(model: ModelName, id: string) {
  const delegate = prisma[model] as {
    delete: (args: object) => Promise<unknown>;
  };

  try {
    await delegate.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Not found or could not delete", 404);
  }
}

export async function parseBody(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const fileFields = ["image", "images", "mobImage", "video", "videoThumbnail", "featuredImage", "logo", "file"];
    const uploads = await parseFormDataFiles(formData, fileFields);

    const flat: Record<string, unknown> = { ...uploads };
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      if (key in uploads) return;
      flat[key] = coerceFormValue(value.toString());
    });
    return parseBracketFormData(flat);
  }
  return req.json();
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
