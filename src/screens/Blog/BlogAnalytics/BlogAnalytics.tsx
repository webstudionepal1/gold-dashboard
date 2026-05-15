import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";

import { Text } from "../../../components/shared/Text";
import Header from "../../../components/shared/table_heading/Header";
import { useGetBlogAnalyticsQuery } from "../../../server/api/blogHooks";
import { FrontendRoutes } from "../../../routes/routes";

const BlogAnalytics: React.FC = () => {
  const { data: analytics, isLoading, error } = useGetBlogAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="svg-spinners:ring-resize" width="32" height="32" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <Icon icon="material-symbols:error-outline" width="48" height="48" className="mx-auto mb-4 text-red-500" />
        <Text size="body-lg-default" variant="red">
          Failed to load analytics data
        </Text>
      </div>
    );
  }

  const { overview, recentActivity } = analytics;

  // Stats cards data
  const statsCards = [
    {
      title: "Total Blogs",
      value: overview.totalBlogs,
      icon: "material-symbols:article-outline",
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Published",
      value: overview.publishedBlogs,
      icon: "material-symbols:publish",
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Drafts",
      value: overview.draftBlogs,
      icon: "material-symbols:draft-outline",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Archived",
      value: overview.archivedBlogs,
      icon: "material-symbols:archive-outline",
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Featured",
      value: overview.featuredBlogs,
      icon: "material-symbols:star-outline",
      color: "bg-orange",
      textColor: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      title: "Total Views",
      value: overview.totalViews.toLocaleString(),
      icon: "material-symbols:visibility-outline",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Likes",
      value: overview.totalLikes.toLocaleString(),
      icon: "material-symbols:favorite-outline",
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="">
      <Header text="Blog Analytics">
        <Link to={FrontendRoutes.ADDBLOG}>
          <button className="bg-orange hover:bg-orange/90 text-sm text-white px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200">
            <Icon icon="material-symbols:add" fontSize={18} />
            Create Blog
          </button>
        </Link>
      </Header>

      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="body-xs-default" variant="grey-500" className="uppercase tracking-wide">
                    {stat.title}
                  </Text>
                  <Text size="body-lg-rare" className="mt-2">
                    {stat.value}
                  </Text>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon icon={stat.icon} className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Blogs */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <Text size="body-md-lg">Recent Blogs</Text>
                <Link 
                  to={FrontendRoutes.BLOGLIST}
                  className="text-orange hover:text-orange/80 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentActivity.recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.recentBlogs.map((blog) => (
                    <div key={blog._id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Icon icon="material-symbols:image-outline" className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`${FrontendRoutes.BLOGDETAILS.replace(":id", blog._id)}`}
                          className="block"
                        >
                          <Text size="body-sm-lg" className="truncate hover:text-orange">
                            {blog.title}
                          </Text>
                        </Link>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published' ? 'bg-green-100 text-green-800' :
                            blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {blog.status}
                          </span>
                          <Text size="body-xs-default" variant="grey-400">
                            {format(new Date(blog.createdAt), "MMM dd")}
                          </Text>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Icon icon="material-symbols:visibility-outline" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon icon="material-symbols:favorite-outline" />
                            {blog.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="material-symbols:article-outline" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <Text size="body-sm-default" variant="grey-400">
                    No recent blogs
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Top Viewed Blogs */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <Text size="body-md-lg">Most Viewed</Text>
            </div>
            <div className="p-6">
              {recentActivity.topViewedBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.topViewedBlogs.map((blog, index) => (
                    <div key={blog._id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 text-center">
                        <Text size="body-sm-lg" variant="grey-400">
                          #{index + 1}
                        </Text>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`${FrontendRoutes.BLOGDETAILS.replace(":id", blog._id)}`}
                          className="block"
                        >
                          <Text size="body-sm-default" className="truncate hover:text-orange">
                            {blog.title}
                          </Text>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon icon="material-symbols:visibility-outline" className="w-4 h-4 text-gray-400" />
                          <Text size="body-xs-default" variant="grey-500">
                            {blog.views} views
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="material-symbols:visibility-outline" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <Text size="body-sm-default" variant="grey-400">
                    No viewed blogs yet
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Top Liked Blogs */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <Text size="body-md-lg">Most Liked</Text>
            </div>
            <div className="p-6">
              {recentActivity.topLikedBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.topLikedBlogs.map((blog, index) => (
                    <div key={blog._id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 text-center">
                        <Text size="body-sm-lg" variant="grey-400">
                          #{index + 1}
                        </Text>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`${FrontendRoutes.BLOGDETAILS.replace(":id", blog._id)}`}
                          className="block"
                        >
                          <Text size="body-sm-default" className="truncate hover:text-orange">
                            {blog.title}
                          </Text>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon icon="material-symbols:favorite-outline" className="w-4 h-4 text-gray-400" />
                          <Text size="body-xs-default" variant="grey-500">
                            {blog.likes} likes
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="material-symbols:favorite-outline" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <Text size="body-sm-default" variant="grey-400">
                    No liked blogs yet
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6">
          <Text size="body-md-lg" className="mb-4">Quick Actions</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={FrontendRoutes.ADDBLOG}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-orange/10 rounded-lg">
                <Icon icon="material-symbols:add" className="w-5 h-5 text-orange" />
              </div>
              <div>
                <Text size="body-sm-lg">Create New Blog</Text>
                <Text size="body-xs-default" variant="grey-400">
                  Start writing a new blog post
                </Text>
              </div>
            </Link>

            <Link
              to={FrontendRoutes.BLOGLIST}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon icon="material-symbols:list" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Text size="body-sm-lg">Manage Blogs</Text>
                <Text size="body-xs-default" variant="grey-400">
                  View and edit existing blogs
                </Text>
              </div>
            </Link>

            <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="p-2 bg-green-50 rounded-lg">
                <Icon icon="material-symbols:trending-up" className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Text size="body-sm-lg">Performance</Text>
                <Text size="body-xs-default" variant="grey-400">
                  {overview.totalViews > 0 
                    ? `${Math.round(overview.totalViews / overview.totalBlogs)} avg views per blog`
                    : "No performance data yet"
                  }
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAnalytics;