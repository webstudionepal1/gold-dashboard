import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../../../components/shared/table_heading/Header';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import { StatusSwitch } from '../../../components/shared/StatusSwitch';
import { Text } from '../../../components/shared/Text';
import { Button } from '../../../components/ui/button';
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
  useToggleFeaturedMutation,
  useSearchBlogsQuery,
  useUpdateBlogMutation,
} from '../../../server/api/blogHooks';
import { IBlog, IBlogSearchParams } from '../../../types/blog.types';
import { FrontendRoutes } from '../../../routes/routes';

const BlogList: React.FC = () => {
  const navigate = useNavigate();

  // State for filters and search
  const [searchParams, setSearchParams] = useState<IBlogSearchParams>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
    featured: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // const queryParams=buildQueryParams

  // API hooks - now using search endpoint with parameters
  const { data: blogData, isLoading } = useSearchBlogsQuery(searchParams);
  const { mutate: deleteBlog } = useDeleteBlogMutation();
  const { mutate: toggleFeatured } = useUpdateBlogMutation();

  // Filter and sort options for advanced search
  const filterOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'publishedAt-desc', label: 'Recently Published' },
    { value: 'publishedAt-asc', label: 'Oldest Published' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'views-desc', label: 'Most Viewed' },
    { value: 'views-asc', label: 'Least Viewed' },
    { value: 'likes-desc', label: 'Most Liked' },
    { value: 'likes-asc', label: 'Least Liked' },
  ];

  // Event handlers
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  const handleFilter = useCallback((filter: string) => {
    setSearchParams((prev) => ({
      ...prev,
      status: filter
        ? (filter as 'draft' | 'published' | 'archived')
        : undefined,
      page: 1,
    }));
  }, []);

  const handleSort = useCallback((sort: string) => {
    const [sortBy, sortOrder] = sort.split('-');
    setSearchParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    }));
  }, []);

  const handleEdit = useCallback(
    (blog: IBlog) => {
      navigate(`${FrontendRoutes.EDITBLOG.replace(':id', blog._id)}`);
    },
    [navigate]
  );

  const handleView = useCallback(
    (blog: IBlog) => {
      navigate(`${FrontendRoutes.BLOGDETAILS.replace(':id', blog._id)}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this blog?')) {
        deleteBlog(id);
      }
    },
    [deleteBlog]
  );

  const handleToggleFeatured = useCallback(
    (blog: IBlog) => {
      const formData = new FormData();
      formData.append('isActive', String(!blog.isActive));
      toggleFeatured({
        id: blog._id,
        formData,
      });
    },
    [toggleFeatured]
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Blog Card Component
  const BlogCard: React.FC<{ blog: IBlog }> = ({ blog }) => (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Featured Image */}
      <div className="aspect-[2/1] w-full overflow-hidden bg-gray-100">
        {blog.featuredImage ? (
          <img
            src={String(import.meta.env.VITE_API_IMAGE_BASE_URL).concat(
              blog.featuredImage
            )}
            alt={blog.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              icon="material-symbols:image-outline"
              className="w-12 h-12 text-gray-300"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status and Featured Badges */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              blog.status
            )}`}
          >
            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
          </span>
          {blog.isFeatured && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-customorange/10 text-customorange flex items-center gap-1">
              <Icon icon="material-symbols:star" className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2  group-hover:text-customorange transition-colors line-clamp-1">
          {blog.title}
        </h3>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-1">
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Icon
                icon="material-symbols:visibility-outline"
                className="w-4 h-4"
              />
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <Icon
                icon="material-symbols:favorite-outline"
                className="w-4 h-4"
              />
              {blog.likes}
            </span>
          </div>
          <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleView(blog)}
              className="text-xs"
            >
              <Icon
                icon="material-symbols:visibility-outline"
                className="w-4 h-4 mr-1"
              />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(blog)}
              className="text-xs"
            >
              <Icon
                icon="material-symbols:edit-outline"
                className="w-4 h-4 mr-1"
              />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(blog._id)}
              className="text-xs"
            >
              <Icon
                icon="material-symbols:delete-outline"
                className="w-4 h-4 mr-1"
              />
              Delete
            </Button>
          </div>

          <div className="flex items-center ml-4">
            <StatusSwitch
              isActive={blog.isActive}
              onToggle={() => handleToggleFeatured(blog)}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      <Header text="All Blogs">
        <Link to={FrontendRoutes.ADDBLOG}>
          <button className="bg-customorange hover:bg-customorangedark text-sm text-white px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200">
            <Icon icon="material-symbols:add" fontSize={18} />
            Create Blog
          </button>
        </Link>
      </Header>

      <div className="p-4 bg-white border-2 rounded-lg">
        {/* Filter Section */}
        <div className="mb-6">
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search blogs by title, content, tags, or categories..."
            showFilter={true}
            showSort={true}
            showView={false}
          />

          {/* Additional Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured-filter"
                checked={searchParams.featured === true}
                onChange={(e) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    featured: e.target.checked ? true : undefined,
                    page: 1,
                  }));
                }}
                className="w-4 h-4 text-customorange bg-gray-100 border-gray-300 rounded focus:ring-customorange focus:ring-2"
              />
              <label
                htmlFor="featured-filter"
                className="text-sm font-medium text-gray-700"
              >
                Featured Only
              </label>
            </div>

            {/* Search Results Info */}
            {/* {blogData && (
              <div className="text-sm text-gray-500 ml-auto">
                {blogData.pagination.totalBlogs} blog
                {blogData.pagination.totalBlogs !== 1 ? "s" : ""} found
                {searchParams.search && (
                  <span> for "{searchParams.search}"</span>
                )}
              </div>
            )} */}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogData?.blogs && blogData.blogs.length > 0 ? (
          <>
            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogData.blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {blogData.pagination && blogData.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSearchParams((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page! - 1),
                      }))
                    }
                    disabled={!blogData.pagination.hasPrev}
                  >
                    <Icon
                      icon="material-symbols:chevron-left"
                      className="w-4 h-4"
                    />
                    Previous
                  </Button>

                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {blogData.pagination.currentPage} of{' '}
                    {blogData.pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSearchParams((prev) => ({
                        ...prev,
                        page: prev.page! + 1,
                      }))
                    }
                    disabled={!blogData.pagination.hasNext}
                  >
                    Next
                    <Icon
                      icon="material-symbols:chevron-right"
                      className="w-4 h-4"
                    />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Icon
              icon="material-symbols:article-outline"
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
            />
            <Text size="body-lg-default" variant="grey-400" className="mb-4">
              No blogs found. Create your first blog to get started!
            </Text>
            <Link to={FrontendRoutes.ADDBLOG}>
              <Button className="bg-customorange hover:bg-customorangedark">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BlogList);
