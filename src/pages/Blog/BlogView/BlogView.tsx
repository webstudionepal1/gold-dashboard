import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

import { Text } from "../../../components/shared/Text";
import "../BlogEditor/BlogEditor.css";
import { Button } from "../../../components/ui/button";
import {
  useGetBlogByIdQuery,
  useLikeBlogMutation,
  useGetAllBlogsQuery,
} from "../../../server/api/blogHooks";
import { FrontendRoutes } from "../../../routes/routes";

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: blog, isLoading, error } = useGetBlogByIdQuery(id!);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlogMutation();
  const { data: relatedBlogs } = useGetAllBlogsQuery({
    limit: 4,
    status: "published",
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    const bookmarked = localStorage.getItem(`bookmark_${id}`) === "true";
    setIsBookmarked(bookmarked);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  const handleLike = () => {
    if (blog?._id) {
      likeBlog(blog._id);
    }
  };

  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(`bookmark_${id}`, newBookmarkState.toString());
    toast.success(newBookmarkState ? "Bookmarked! 📖" : "Bookmark removed");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "Check out this blog";

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied! 📋");
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  const handleBack = () => {
    navigate(FrontendRoutes.BLOGLIST);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="svg-spinners:90-ring-with-bg"
            width="32"
            height="32"
            className="mx-auto mb-2"
          />
          <Text size="body-md-default">Loading...</Text>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="material-symbols:error-outline"
            width="32"
            height="32"
            className="mx-auto mb-2 text-red-500"
          />
          <Text size="body-md-default" className="mb-3">
            Blog not found
          </Text>
          <Button onClick={handleBack} variant="outline" size="sm">
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress - Minimal */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gray-100 z-50">
        <div
          className="h-full bg-customorange transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header - Ultra Minimal */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              size="sm"
              className="h-8 px-2"
            >
              <Icon icon="material-symbols:arrow-back" className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className="h-8 w-8 p-0"
              >
                <Icon
                  icon={
                    isLiking
                      ? "svg-spinners:90-ring-with-bg"
                      : "material-symbols:favorite-outline"
                  }
                  className={`w-4 h-4 ${isLiking ? "" : "hover:text-red-500"}`}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="h-8 w-8 p-0"
              >
                <Icon
                  icon={
                    isBookmarked
                      ? "material-symbols:bookmark"
                      : "material-symbols:bookmark-outline"
                  }
                  className={`w-4 h-4 ${
                    isBookmarked
                      ? "text-customorange"
                      : "hover:text-customorange"
                  }`}
                />
              </Button>

              <div className="relative group">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Icon icon="material-symbols:share" className="w-4 h-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-sm border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="py-1">
                    {[
                      {
                        icon: "mdi:twitter",
                        text: "Twitter",
                        platform: "twitter",
                      },
                      {
                        icon: "mdi:facebook",
                        text: "Facebook",
                        platform: "facebook",
                      },
                      {
                        icon: "mdi:linkedin",
                        text: "LinkedIn",
                        platform: "linkedin",
                      },
                      {
                        icon: "mdi:whatsapp",
                        text: "WhatsApp",
                        platform: "whatsapp",
                      },
                      {
                        icon: "material-symbols:content-copy",
                        text: "Copy",
                        platform: "copy",
                      },
                    ].map(({ icon, text, platform }) => (
                      <button
                        key={platform}
                        onClick={() => handleShare(platform)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        <Icon icon={icon} className="w-3.5 h-3.5" />
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {blog.isFeatured && (
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Featured
                </span>
              )}

              <Link to={FrontendRoutes.EDITBLOG.replace(":id", blog._id)}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                >
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Tight Grid */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Article - Clean & Minimal */}
          <article className="space-y-4">
            {/* Featured Image */}
            {blog.featuredImage && (
              <figure className="aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                    blog.featuredImage
                  }`}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            {/* Header */}
            <header className="space-y-2">
              <Text as="h1" className="leading-tight">
                {blog.title}
              </Text>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>By {blog.author?.name || "Unknown"}</span>
                <span>•</span>
                <span>{format(new Date(blog.createdAt), "MMM dd, yyyy")}</span>
                {blog.readTime && (
                  <>
                    <span>•</span>
                    <span>{blog.readTime} min</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icon
                    icon="material-symbols:visibility"
                    className="w-3 h-3"
                  />
                  {blog.views}
                </span>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 hover:text-red-500"
                >
                  <Icon
                    icon="material-symbols:favorite-outline"
                    className="w-3 h-3"
                  />
                  {blog.likes}
                </button>
              </div>

              {blog.excerpt && (
                <Text
                  size="body-md-default"
                  className="italic text-gray-600 pl-3 border-l border-gray-200"
                >
                  {blog.excerpt}
                </Text>
              )}
            </header>

            {/* Content */}
            <div
              className="prose prose-neutral max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Footer - Compact */}
            <footer className="pt-4 space-y-4">
              {/* Images Gallery */}
              {(blog as any).images?.length > 0 && (
                <div>
                  <Text size="body-sm-default" className="mb-2 text-gray-600">
                    Images
                  </Text>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(blog as any).images.map((image: any, index: any) => (
                      <div
                        key={index}
                        className="aspect-square rounded overflow-hidden cursor-pointer"
                        onClick={() => openImageModal(index)}
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_API_IMAGE_BASE_URL
                          }${image}`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {blog.video && (
                <div className="aspect-video rounded overflow-hidden">
                  <video src={blog.video} controls className="w-full h-full" />
                </div>
              )}

              {/* Updated */}
              <Text size="body-xs-default" className="text-gray-500">
                Updated {format(new Date(blog.updatedAt), "MMM dd, yyyy")}
              </Text>
            </footer>
          </article>

          {/* Sidebar - Compact */}
          <aside className="lg:sticky lg:top-4 space-y-4">
            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-3">
              <Text className="mb-2">Stats</Text>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-medium text-red-500">{blog.likes}</span>
                </div>
                {blog.readTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read time</span>
                    <span className="font-medium">{blog.readTime} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 rounded-lg p-3">
              <Text className="mb-2">Actions</Text>
              <div className="space-y-1.5">
                <Button
                  onClick={handleLike}
                  disabled={isLiking}
                  size="sm"
                  className="h-8 w-full justify-center text-xs"
                  variant="outline"
                >
                  <Icon
                    icon={
                      isLiking
                        ? "svg-spinners:90-ring-with-bg"
                        : "material-symbols:favorite"
                    }
                    className="w-3 h-3 mr-1.5"
                  />
                  Like
                </Button>
                <Button
                  onClick={handleBookmark}
                  size="sm"
                  className={`h-8 w-full justify-center text-xs ${
                    isBookmarked
                      ? "text-customorange border-customorange"
                      : "text-gray-600"
                  }`}
                  variant="outline"
                >
                  <Icon
                    icon={
                      isBookmarked
                        ? "material-symbols:bookmark"
                        : "material-symbols:bookmark-outline"
                    }
                    className="w-3 h-3 mr-1.5"
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <Text className="mb-2">Tags</Text>
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-white text-customorange rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related - Tight */}
        {relatedBlogs?.blogs && relatedBlogs.blogs.length > 0 && blog && (
          <section className="mt-8">
            <Text className="mb-4">Related</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedBlogs.blogs
                .filter((b) => b._id !== blog._id)
                .slice(0, 4)
                .map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    to={FrontendRoutes.BLOGDETAILS.replace(
                      ":id",
                      relatedBlog._id
                    )}
                    className="group"
                  >
                    <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                      {relatedBlog.featuredImage && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                              relatedBlog.featuredImage
                            }`}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <Text className="line-clamp-2 group-hover:text-customorange mb-1">
                          {relatedBlog.title}
                        </Text>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {format(new Date(relatedBlog.createdAt), "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon
                              icon="material-symbols:favorite-outline"
                              className="w-3 h-3"
                            />
                            {relatedBlog.likes}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Image Modal */}
        {isImageModalOpen && selectedImageIndex !== null && blog.images && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeImageModal}
                className="absolute top-3 right-3 text-white hover:text-gray-300"
              >
                <Icon icon="material-symbols:close" className="w-6 h-6" />
              </button>
              <img
                src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                  blog.images[selectedImageIndex]
                }`}
                alt={`Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                {selectedImageIndex + 1} / {blog.images.length}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogView;
