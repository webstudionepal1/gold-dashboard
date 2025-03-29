import { Icon } from "@iconify/react/dist/iconify.js"
import { Product } from "../../../../../types/Products.interface"

export const ProductImage: React.FC<{
    product: Product
    selectedImageIndex: number
    scrollRef: React.RefObject<HTMLDivElement | null>
    canScrollLeft: boolean
    canScrollRight: boolean
    scrollLeft: () => void
    scrollRight: () => void
    onThumbnailClick: (index: number) => void
}> = ({ product, selectedImageIndex, scrollRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight, onThumbnailClick }) => {

    return <div className="flex flex-col">
        <div className="relative flex justify-center rounded-md shadow-sm">
            <div className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-1 text-xs text-white">24 Carat</div>
            <img
                src={product.images?.[selectedImageIndex] || product.image || "/placeholder.svg"}
                alt={product.title}
                className="h-auto w-full rounded-md object-center"
            />
        </div>
        <div className="group relative mt-4">
            <div className="flex w-full items-center">
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`z-10 rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 group-hover:opacity-100 ${canScrollLeft ? "text-gray-600 " : "cursor-not-allowed text-gray-400"}`}
                >
                    <Icon icon="mdi:chevron-left" className="h-6 w-6" />
                </button>
                <div ref={scrollRef} className="mx-4 flex flex-1 gap-2 overflow-x-hidden scroll-smooth" style={{ scrollBehavior: "smooth" }}>
                    {(product.images || Array(7).fill(product.image)).map((img, i) => (
                        <div
                            key={i}
                            onClick={() => onThumbnailClick(i)}
                            className={`flex-shrink-0 rounded  cursor-pointer transition-all ${i === selectedImageIndex ? "border border-blue-500 " : "border border-gray-200 hover:border-blue-300"}`}
                        >
                            <img src={img || "/placeholder.svg"} alt={`${product.title} view ${i + 1}`} className="h-16 w-16 object-cover" />
                        </div>
                    ))}
                </div>
                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`z-10 rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 group-hover:opacity-100 ${canScrollRight ? "text-gray-600" : "cursor-not-allowed text-gray-400"}`}
                >
                    <Icon icon="mdi:chevron-right" className="h-6 w-6" />
                </button>
            </div>
        </div>
    </div>
}