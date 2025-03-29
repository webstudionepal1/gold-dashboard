import { Icon } from "@iconify/react/dist/iconify.js";
import { Product } from "../../../../../types/Products.interface";

export const ReviewsSection: React.FC<{ product: Product }> = ({ product }) => {
    return <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Reviews & Comments</h2>

        <div className="flex items-center flex-col gap-8 md:flex-row">
            <div className="flex-1">
                <h3 className="mb-4 font-semibold">Summary</h3>
                <div className="w-5/6 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center">
                            <span className="w-4">{star}</span>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-amber-500"
                                    style={{ width: `${star === 5 ? "80%" : star === 4 ? "60%" : star === 3 ? "40%" : "20%"}` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center mr-16">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{product.reviews?.average.toFixed(1)}</span>
                    <Icon icon="mdi:star" className="h-6 w-6 text-amber-500" />
                </div>
                <p className="mt-1 text-gray-500">{product.reviews?.count} Reviews</p>
                <div className="mt-2 rounded-xl bg-[#E6F7FF] px-2 py-1 text-xs text-[#007CB5]">
                    Verified by <span className="text-sm font-semibold text-[#023d56ec]">shop</span>
                </div>
            </div>

        </div>

        {/*review description */}
        <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Product Reviews</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort By:</span>
                    <label htmlFor="sort-select" className="sr-only">Sort By</label>
                    <select id="sort-select" className="rounded border p-1 text-sm" aria-label="Sort By">
                        <option>Relevant</option>
                        <option>Newest</option>
                        <option>Highest Rating</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                {product.reviews?.items.map((review, index) => (
                    <div key={index} className="rounded-sm bg-white p-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex flex-row items-center gap-2">
                                    <h1 className="font-medium">{review.author}</h1>
                                    {review.verified && (
                                        <div className="flex items-center text-xs text-[#009EE8]">
                                            <Icon icon="material-symbols:verified-rounded" className="mr-1 h-4 w-4" />
                                            Purchase Verified
                                        </div>
                                    )}
                                </div>
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Icon key={i} icon={i < review.rating ? "mdi:star" : "mdi:star-outline"} className="h-4 w-4 text-amber-500" />
                                    ))}
                                </div>
                                <h4 className="mt-2 font-medium">{review.text.split("!")[0]}!</h4>
                                <p className="text-sm text-gray-600">{review.text.split("!")[1]}</p>
                            </div>
                            <div className="flex gap-2">
                                <img src={product.image || "/placeholder.svg"} alt="Product" className="h-16 w-16 rounded object-cover" />
                                <img src={product.image || "/placeholder.svg"} alt="Product" className="h-16 w-16 rounded object-cover" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}