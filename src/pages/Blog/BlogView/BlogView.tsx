import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import DOMPurify from "dompurify";

import { Text } from "../../../components/shared/Text";
import "../BlogEditor/BlogEditor.css";
import { Button } from "../../../components/ui/button";
import {
  useGetBlogByIdQuery,
  useLikeBlogMutation,
} from "../../../server/api/blogHooks";
import { FrontendRoutes } from "../../../routes/routes";

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // API hooks
  const { data: blog, isLoading, error } = useGetBlogByIdQuery(id!);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlogMutation();

  // Handle like
  const handleLike = () => {
    if (blog?._id) {
      likeBlog(blog._id);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(FrontendRoutes.BLOGLIST);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="svg-spinners:ring-resize"
            width="48"
            height="48"
            className="mx-auto mb-4"
          />
          <Text size="body-lg-default" variant="grey-400">
            Loading blog...
          </Text>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="material-symbols:error-outline"
            width="48"
            height="48"
            className="mx-auto mb-4 text-red-500"
          />
          <Text size="body-lg-default" variant="red" className="mb-4">
            Blog not found or failed to load
          </Text>
          <Button onClick={handleBack} variant="outline">
            Back to Blog List
          </Button>
        </div>
      </div>
    );
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <Icon icon="material-symbols:arrow-back" />
              Back to Blogs
            </Button>

            <div className="flex items-center gap-2">
              {blog.status === "published" && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Published
                </span>
              )}
              {blog.isFeatured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              <Link to={`${FrontendRoutes.EDITBLOG.replace(":id", blog._id)}`}>
                <Button size="sm" variant="outline">
                  <Icon icon="material-symbols:edit-outline" className="mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <header className="mb-6">
              <Text
                as="h1"
                size="heading-lg-rare"
                className="mb-4 leading-tight"
              >
                {blog.title}
              </Text>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:person-outline" />
                  <span>By {blog.author?.name || "Unknown Author"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:calendar-today-outline" />
                  <span>
                    {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>

                {blog.readTime && (
                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:schedule-outline" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icon icon="material-symbols:visibility-outline" />
                    <span>{blog.views}</span>
                  </div>

                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Icon
                      icon={
                        isLiking
                          ? "svg-spinners:ring-resize"
                          : "material-symbols:favorite-outline"
                      }
                      className={isLiking ? "animate-spin" : ""}
                    />
                    <span>{blog.likes}</span>
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              {blog.excerpt && (
                <Text
                  size="body-lg-default"
                  variant="grey-500"
                  className="italic mb-6"
                >
                  {blog.excerpt}
                </Text>
              )}
            </header>

            {/* Blog Content */}
            <div
              className="blog-content prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Tags and Categories */}
            <footer className="border-t pt-6">
              {(blog.tags.length > 0 || blog.categories.length > 0) && (
                <div className="space-y-4">
                  {blog.tags.length > 0 && (
                    <div>
                      <Text size="body-sm-lg" className="mb-2">
                        Tags:
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange/10 text-orange"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {blog.categories.length > 0 && (
                    <div>
                      <Text size="body-sm-lg" className="mb-2">
                        Categories:
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {blog.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow/10 text-yellow"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Images */}
              {blog.images && blog.images.length > 0 && (
                <div className="mt-6">
                  <Text size="body-sm-lg" className="mb-3">
                    Additional Images:
                  </Text>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {blog.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video overflow-hidden rounded-lg"
                      >
                        <img
                          src={image}
                          alt={`Additional image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(image, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {blog.video && (
                <div className="mt-6">
                  <Text size="body-sm-lg" className="mb-3">
                    Video:
                  </Text>
                  <div className="aspect-video">
                    <video
                      src={blog.video}
                      controls
                      className="w-full h-full rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* SEO Information (for admin view) */}
              {blog.metadata &&
                (blog.metadata.seoTitle || blog.metadata.seoDescription) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <Text size="body-sm-lg" className="mb-2">
                      SEO Information:
                    </Text>
                    {blog.metadata.seoTitle && (
                      <div className="mb-2">
                        <Text size="body-xs-lg">SEO Title:</Text>
                        <Text size="body-xs-default" variant="grey-500">
                          {blog.metadata.seoTitle}
                        </Text>
                      </div>
                    )}
                    {blog.metadata.seoDescription && (
                      <div className="mb-2">
                        <Text size="body-xs-lg">SEO Description:</Text>
                        <Text size="body-xs-default" variant="grey-500">
                          {blog.metadata.seoDescription}
                        </Text>
                      </div>
                    )}
                    {blog.metadata.keywords &&
                      blog.metadata.keywords.length > 0 && (
                        <div>
                          <Text size="body-xs-lg">Keywords:</Text>
                          <Text size="body-xs-default" variant="grey-500">
                            {blog.metadata.keywords.join(", ")}
                          </Text>
                        </div>
                      )}
                  </div>
                )}

              {/* Last Updated */}
              <div className="mt-6 text-sm text-gray-500">
                Last updated:{" "}
                {format(new Date(blog.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogView;
