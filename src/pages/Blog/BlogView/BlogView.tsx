import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

import { Text } from '../../../components/shared/Text';
import '../BlogEditor/BlogEditor.css';
import { Button } from '../../../components/ui/button';
import {
  useGetBlogByIdQuery,
  useLikeBlogMutation,
  useGetAllBlogsQuery,
} from '../../../server/api/blogHooks';
import { FrontendRoutes } from '../../../routes/routes';

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for enhanced features
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // API hooks
  const { data: blog, isLoading, error } = useGetBlogByIdQuery(id!);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlogMutation();
  const { data: relatedBlogs } = useGetAllBlogsQuery({
    limit: 4,
    status: 'published',
  });

  // Enhanced functionality
  useEffect(() => {
    // Reading progress tracker
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    // Check if blog is bookmarked (from localStorage)
    const bookmarked = localStorage.getItem(`bookmark_${id}`) === 'true';
    setIsBookmarked(bookmarked);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  // Handle like with enhanced feedback
  const handleLike = () => {
    if (blog?._id) {
      likeBlog(blog._id);
    }
  };

  // Handle bookmark toggle
  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(`bookmark_${id}`, newBookmarkState.toString());
    toast.success(
      newBookmarkState ? 'Blog bookmarked! 📖' : 'Bookmark removed'
    );
  };

  // Handle social sharing
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog';

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

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard! 📋');
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  // Handle image modal
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(null);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-customorange to-customorangedark transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-full mx-auto px-4 py-2">
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
              {/* Action Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${
                  isBookmarked ? 'text-customorange' : 'text-gray-600'
                }`}
              >
                <Icon
                  icon={
                    isBookmarked
                      ? 'material-symbols:bookmark'
                      : 'material-symbols:bookmark-outline'
                  }
                  className="w-5 h-5"
                />
              </Button>

              {/* Share Dropdown */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Icon icon="material-symbols:share" className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <Icon
                        icon="mdi:twitter"
                        className="w-4 h-4 text-blue-400"
                      />
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <Icon
                        icon="mdi:facebook"
                        className="w-4 h-4 text-blue-600"
                      />
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <Icon
                        icon="mdi:linkedin"
                        className="w-4 h-4 text-blue-700"
                      />
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <Icon
                        icon="mdi:whatsapp"
                        className="w-4 h-4 text-green-500"
                      />
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <Icon
                        icon="material-symbols:content-copy"
                        className="w-4 h-4 text-gray-600"
                      />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              {blog.status === 'published' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Published
                </span>
              )}
              {blog.isFeatured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Featured
                </span>
              )}

              <Link to={FrontendRoutes.EDITBLOG.replace(':id', blog._id)}>
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
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Article */}
          <article className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={
                    blog.featuredImage
                      ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                          blog.featuredImage
                        }`
                      : '/no-image.png'
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <header className="mb-4">
                <Text
                  as="h1"
                  size="heading-lg-rare"
                  className="mb-3 leading-tight text-gray-900"
                >
                  {blog.title}
                </Text>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:person-outline" />
                    <span>By {blog.author?.name || 'Unknown Author'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:calendar-today-outline" />
                    <span>
                      {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
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
                            ? 'svg-spinners:ring-resize'
                            : 'material-symbols:favorite-outline'
                        }
                        className={isLiking ? 'animate-spin' : ''}
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
                    className="italic mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-customorange"
                  >
                    {blog.excerpt}
                  </Text>
                )}
              </header>

              {/* Blog Content */}
              <div
                className="blog-content prose prose-lg max-w-none mb-6 text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Footer */}
              <footer className="border-t pt-4">
                {/* Additional Images with Enhanced Gallery */}
                {blog.images && blog.images.length > 0 && (
                  <div className="mt-6">
                    <Text size="body-sm-lg" className="mb-3">
                      Additional Images:
                    </Text>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {blog.images.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-video overflow-hidden rounded-lg group cursor-pointer"
                          onClick={() => openImageModal(index)}
                        >
                          <img
                            src={image}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <Icon
                              icon="material-symbols:zoom-in"
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Modal */}
                {isImageModalOpen &&
                  selectedImageIndex !== null &&
                  blog.images && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                      <div className="relative max-w-4xl max-h-full">
                        <button
                          onClick={closeImageModal}
                          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                          <Icon
                            icon="material-symbols:close"
                            className="w-8 h-8"
                          />
                        </button>
                        <img
                          src={blog.images[selectedImageIndex]}
                          alt={`Image ${selectedImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                          {selectedImageIndex + 1} of {blog.images.length}
                        </div>
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
                              {blog.metadata.keywords.join(', ')}
                            </Text>
                          </div>
                        )}
                    </div>
                  )}

                {/* Last Updated */}
                <div className="mt-6 text-sm text-gray-500">
                  Last updated:{' '}
                  {format(
                    new Date(blog.updatedAt),
                    "MMMM dd, yyyy 'at' h:mm a"
                  )}
                </div>
              </footer>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Blog Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <Text
                size="body-lg-lg"
                className="font-semibold mb-3 text-gray-900"
              >
                Blog Stats
              </Text>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Icon
                      icon="material-symbols:visibility-outline"
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="font-semibold text-customorange">
                    {blog.views}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Icon
                      icon="material-symbols:favorite-outline"
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="font-semibold text-red-500">
                    {blog.likes}
                  </span>
                </div>
                {blog.readTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon
                        icon="material-symbols:schedule-outline"
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Read Time</span>
                    </div>
                    <span className="font-semibold text-blue-500">
                      {blog.readTime} min
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Icon
                      icon="material-symbols:calendar-today-outline"
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Published</span>
                  </div>
                  <span className="font-semibold text-green-500 text-xs">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <Text
                size="body-lg-lg"
                className="font-semibold mb-3 text-gray-900"
              >
                Quick Actions
              </Text>
              <div className="space-y-2">
                <Button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                  variant="outline"
                  size="sm"
                >
                  <Icon
                    icon={
                      isLiking
                        ? 'svg-spinners:ring-resize'
                        : 'material-symbols:favorite'
                    }
                    className="w-4 h-4 mr-2"
                  />
                  {isLiking ? 'Liking...' : 'Like Blog'}
                </Button>

                <Button
                  onClick={handleBookmark}
                  className={`w-full ${
                    isBookmarked
                      ? 'bg-customorange/10 hover:bg-customorange/20 text-customorange border-customorange/30'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                  variant="outline"
                  size="sm"
                >
                  <Icon
                    icon={
                      isBookmarked
                        ? 'material-symbols:bookmark'
                        : 'material-symbols:bookmark-outline'
                    }
                    className="w-4 h-4 mr-2"
                  />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Text
                  size="body-lg-lg"
                  className="font-semibold mb-3 text-gray-900"
                >
                  Tags
                </Text>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-customorange/10 text-customorange border border-customorange/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {blog.categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Text
                  size="body-lg-lg"
                  className="font-semibold mb-3 text-gray-900"
                >
                  Categories
                </Text>
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Blogs Section */}
        {relatedBlogs &&
          relatedBlogs.blogs &&
          relatedBlogs.blogs.length > 0 &&
          blog && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Text size="heading-lg-rare" className="mb-4 text-gray-900">
                  Related Articles
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedBlogs.blogs
                    .filter((relatedBlog) => relatedBlog._id !== blog._id)
                    .slice(0, 4)
                    .map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        to={FrontendRoutes.BLOGDETAILS.replace(
                          ':id',
                          relatedBlog._id
                        )}
                        className="group"
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
                          {relatedBlog.featuredImage && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={relatedBlog.featuredImage}
                                alt={relatedBlog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <Text
                              size="body-sm-lg"
                              className="font-semibold mb-2 group-hover:text-customorange transition-colors line-clamp-2"
                            >
                              {relatedBlog.title}
                            </Text>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                {format(
                                  new Date(relatedBlog.createdAt),
                                  'MMM dd'
                                )}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Icon
                                    icon="material-symbols:visibility-outline"
                                    className="w-3 h-3"
                                  />
                                  {relatedBlog.views}
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
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}

        {/* Floating Back to Top Button */}
        {/* <div className="fixed right-4 bottom-4 z-40">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full shadow-lg bg-customorange hover:bg-customorangedark text-white"
            size="sm"
          >
            <Icon icon="material-symbols:arrow-upward" className="w-4 h-4" />
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default BlogView;
