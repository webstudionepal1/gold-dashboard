import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchReview } from "../../../../../server/api/reviewHooks";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { memo } from "react";

export const ReviewsSection: React.FC<{
  reviews: IFetchReview[];
  product: IFetchProduct;
}> = memo(({ reviews = [], product }) => {
  // Don't render if no reviews and no rating data
  if (
    !reviews.length &&
    (!product?.averageRating || product?.averageRating === 0)
  ) {
    return (
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Reviews & Comments
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon
            icon="mdi:comment-outline"
            className="w-12 h-12 text-gray-300 mb-3"
          />
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No Reviews Yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Be the first to share your thoughts about this product. Your review
            helps other customers make informed decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Reviews & Comments
      </h2>

      <div className="flex items-start flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            Rating Summary
          </h3>
          <div className="w-full space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-xs text-gray-600">{star}</span>
                <div className="h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-1.5 rounded-full bg-amber-500 transition-all duration-300"
                    style={{
                      width: `${
                        star === 5
                          ? "80%"
                          : star === 4
                          ? "60%"
                          : star === 3
                          ? "40%"
                          : "20%"
                      }`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg p-3 min-w-32">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900">
              {product?.averageRating || 0}
            </span>
            <Icon icon="mdi:star" className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {product?.numberOfReviews || 0} Reviews
          </p>
          <div className="mt-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
            <span className="font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort:</span>
              <select className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-amber-500 focus:outline-none">
                <option>Relevant</option>
                <option>Newest</option>
                <option>Highest Rating</option>
              </select>
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {review?.user?.name}
                      </h4>
                      {review?.isVerified && (
                        <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <Icon
                            icon="material-symbols:verified-rounded"
                            className="mr-1 h-3 w-3"
                          />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Icon
                          key={i}
                          icon={
                            i < review.rating ? "mdi:star" : "mdi:star-outline"
                          }
                          className="h-3 w-3 text-amber-500"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                  {review?.images && review.images.length > 0 && (
                    <div className="flex gap-1 flex-shrink-0">
                      {review.images.slice(0, 2).map((item, imgIndex) => (
                        <img
                          key={imgIndex.toString()}
                          src={`${
                            import.meta.env.VITE_API_IMAGE_BASE_URL
                          }${item}`}
                          alt="Review"
                          className="h-12 w-12 rounded object-cover border border-gray-200"
                        />
                      ))}
                      {review.images.length > 2 && (
                        <div className="h-12 w-12 rounded bg-gray-200 border border-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-600 font-medium">
                            +{review.images.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
