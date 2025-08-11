import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchReview } from "../../../../../server/api/reviewHooks";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { memo, useState } from "react";

interface ReviewsSectionProps {
  reviews: IFetchReview[];
  product: IFetchProduct;
  loading?: boolean;
  error?: string | null;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = memo(({
  reviews = [],
  product,
  loading = false,
  error = null
}) => {
  const [sortBy, setSortBy] = useState("relevant");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star: number) =>
    reviews.filter((review: IFetchReview) => review.rating === star).length
  );
  const totalReviews = reviews.length;

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "newest": {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default: {
        // Most relevant: prioritize verified reviews and higher ratings
        const aScore = (a.isVerified ? 1 : 0) + a.rating * 0.2;
        const bScore = (b.isVerified ? 1 : 0) + b.rating * 0.2;
        return bScore - aScore;
      }
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  // Handle loading state
  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
              <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 bg-gray-200 rounded w-8"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="mt-6 space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg shadow-sm p-4">
          <div className="text-center py-8">
            <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-red-700 mb-2">Failed to Load Reviews</h4>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Reviews Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Reviews & Ratings
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="mdi:shield-check" className="w-4 h-4 text-green-500" />
            Verified Reviews
          </div>
        </div>

        {/* Rating Summary - Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {product?.averageRating ? product.averageRating.toFixed(1) : "0.0"}
              </span>
              <Icon icon="mdi:star" className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i}
                  icon={i < Math.floor(product?.averageRating || 0) ? "mdi:star" : "mdi:star-outline"}
                  className="w-4 h-4 text-amber-500"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm text-gray-600">{star}</span>
                    <Icon icon="mdi:star" className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                      style={{
                        width: `${totalReviews > 0 ? (ratingCounts[index] / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 min-w-[30px]">
                    {ratingCounts[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Customer Reviews ({totalReviews})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4">
          {totalReviews > 0 ? (
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {review?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{review?.user?.name || 'Anonymous'}</h4>
                            {review?.isVerified && (
                              <div className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                <Icon icon="mdi:shield-check" className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Icon
                                  key={i}
                                  icon={i < review.rating ? "mdi:star" : "mdi:star-outline"}
                                  className="w-4 h-4 text-amber-500"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Text */}
                      {review.reviewText && review.reviewText.trim() ? (
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {review.reviewText}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic leading-relaxed mb-3">
                          No written review provided.
                        </p>
                      )}
                    </div>

                    {/* Review Images */}
                    {review?.images && review.images.length > 0 && (
                      <div className="flex gap-2 ml-4">
                        {review.images.slice(0, 3).map((item: string, imgIndex: number) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${item}`}
                              alt={`Review image ${imgIndex + 1}`}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform duration-200 cursor-pointer"
                            />
                            {imgIndex === 2 && review.images.length > 3 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">
                                  +{review.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Show More/Less Button */}
              {totalReviews > 3 && (
                <div className="text-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {showAllReviews ? (
                      <>
                        <Icon icon="mdi:chevron-up" className="w-4 h-4" />
                        Show Less Reviews
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                        Show All {totalReviews} Reviews
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon icon="mdi:comment-text-outline" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 mb-2">No Reviews Yet</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
