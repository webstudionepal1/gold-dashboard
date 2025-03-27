"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Icon } from "@iconify/react"

interface Product {
    id: string
    title: string
    price: number
    originalPrice: number
    rating: number
    category: string
    onSale: boolean
    image: string // Main image
    images?: string[] // Array of thumbnail images (optional)
    status?: string
    description?: string
    tags?: string[]
    inventory?: { sku: number; stockQty: number; reorderLevel: number }
    specifications?: { length: string; claspType: string; rhodiumFinish: string }
    natural?: { shape: string; color: string; quantity: string; clarity: string; totalcarat: string; carat: string }
    reviews?: {
        average: number
        count: number
        items: { author: string; rating: number; verified: boolean; text: string }[]
    }
}

const ProductDescription: React.FC = () => {
    const { productId } = useParams<{ productId: string }>()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSpecsOpen, setIsSpecsOpen] = useState(false)
    const [isNaturalOpen, setIsNaturalOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0) // Track selected thumbnail
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))
                const mockProduct: Product = {
                    id: productId || "",
                    title: "Gold Chain",
                    price: 1425.0,
                    originalPrice: 1450.0,
                    rating: 4.5,
                    category: "Gold",
                    onSale: true,
                    image: "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                    // Simulate multiple images for thumbnails
                    images: [
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                    ],
                    status: "On Stock",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    tags: ["Best Seller", "Featured", "New Arrival"],
                    inventory: { sku: 5, stockQty: 25, reorderLevel: 10 },
                    specifications: { length: "700mm", claspType: "Box with safety Clasp", rhodiumFinish: "Yes" },
                    natural: { shape: "Round", color: "Yellow", quantity: "1", clarity: "VS1", totalcarat: "0.5c", carat: "24" },
                    reviews: {
                        average: 4.5,
                        count: 273,
                        items: [
                            { author: "Ruby Buckridge", rating: 4, verified: true, text: "Timeless Elegance! Absolutely love this bag!" },
                            { author: "Lesly Rodriguez", rating: 5, verified: true, text: "Stylish & Versatile. I love how I can wear it!" },
                            { author: "Tom Bayer", rating: 4, verified: true, text: "Great Quality! The craftsmanship is top-notch!" },
                        ],
                    },
                }
                setProduct(mockProduct)
            } catch (error) {
                console.error("Failed to fetch product:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId])

    useEffect(() => {
        const updateScrollState = () => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
                setCanScrollLeft(scrollLeft > 0)
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
            }
        }
        const scrollElement = scrollRef.current
        if (scrollElement) {
            scrollElement.addEventListener("scroll", updateScrollState)
            updateScrollState()
            return () => scrollElement.removeEventListener("scroll", updateScrollState)
        }
    }, [product])

    const toggleSpecs = useCallback(() => setIsSpecsOpen((prev) => !prev), [])
    const toggleNatural = useCallback(() => setIsNaturalOpen((prev) => !prev), [])
    const scrollLeft = useCallback(() => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" }), [])
    const scrollRight = useCallback(() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" }), [])

    // Handle thumbnail click
    const handleThumbnailClick = useCallback((index: number) => {
        setSelectedImageIndex(index)
    }, [])

    if (loading) return <div className="text-center">Loading...</div>
    if (!product) return <div className="text-center">Product not found.</div>

    return (
        <div className="container mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold">Product Description</h1>
            <div className="mt-4 grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
                <ProductImage
                    product={product}
                    selectedImageIndex={selectedImageIndex}
                    scrollRef={scrollRef}
                    canScrollLeft={canScrollLeft}
                    canScrollRight={canScrollRight}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    onThumbnailClick={handleThumbnailClick}
                />
                <ProductDetails product={product} isSpecsOpen={isSpecsOpen} isNaturalOpen={isNaturalOpen} toggleSpecs={toggleSpecs} toggleNatural={toggleNatural} />
            </div>
            <ReviewsSection product={product} />
        </div>
    )
}

// Sub-component: Product Image
const ProductImage: React.FC<{
    product: Product
    selectedImageIndex: number
    scrollRef: React.RefObject<HTMLDivElement | null>
    canScrollLeft: boolean
    canScrollRight: boolean
    scrollLeft: () => void
    scrollRight: () => void
    onThumbnailClick: (index: number) => void
}> = ({ product, selectedImageIndex, scrollRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight, onThumbnailClick }) => (
    <div className="flex flex-col">
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
)

// Sub-component: Product Details
const ProductDetails: React.FC<{
    product: Product
    isSpecsOpen: boolean
    isNaturalOpen: boolean
    toggleSpecs: () => void
    toggleNatural: () => void
}> = ({ product, isSpecsOpen, isNaturalOpen, toggleSpecs, toggleNatural }) => (
    <div className="space-y-4 rounded-md bg-white p-4">
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
                <span className="rounded bg-amber-500 px-2 py-1 text-xs text-white">{product.status}</span>
            </div>
            <p className="text-sm font-semibold text-amber-500">{product.category}</p>
        </div>
        <p className="text-xs text-gray-600">{product.description}</p>
        <div className="flex gap-2">
            {product.tags?.map((tag, index) => (
                <span key={index} className="text-xs text-gray-500">
                    #{tag.replace(/\s+/g, "")}
                </span>
            ))}
        </div>
        <div className="flex items-center gap-3 py-4">
            <span className="text-md font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && <span className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>}
        </div>
        <Inventory inventory={product.inventory} />
        <DropdownSection title="Specifications" isOpen={isSpecsOpen} toggle={toggleSpecs} data={product.specifications} />
        <DropdownSection title="Natural Gold Information" isOpen={isNaturalOpen} toggle={toggleNatural} data={product.natural} />
    </div>
)

// Sub-component: Inventory
const Inventory: React.FC<{ inventory?: Product["inventory"] }> = ({ inventory }) => (
    <div className="space-y-2">
        <h3 className="text-sm font-semibold">Inventory</h3>
        <div className="grid grid-cols-3 gap-4">
            {["Product SKU", "Stock QTY", "Reorder Level"].map((label, index) => (
                <div key={label}>
                    <p className="text-xs text-gray-500">{label}:</p>
                    <p className="font-medium">{inventory ? [inventory.sku, inventory.stockQty, inventory.reorderLevel][index] : "N/A"}</p>
                </div>
            ))}
        </div>
    </div>
)

// Sub-component: Dropdown Section
const DropdownSection: React.FC<{ title: string; isOpen: boolean; toggle: () => void; data?: Record<string, string> }> = ({ title, isOpen, toggle, data }) =>
    data ? (
        <div className="space-y-2">
            <div className="flex cursor-pointer items-center justify-between border-b" onClick={toggle}>
                <h3 className="text-sm font-semibold">{title}</h3>
                <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="h-5 w-5 transition-transform" />
            </div>
            {isOpen && (
                <div className="space-y-2 transition-all duration-300">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span>{value || "N/A"}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null

// Sub-component: Reviews Section
const ReviewsSection: React.FC<{ product: Product }> = ({ product }) => (
    <div className="mt-12">
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
)

export default ProductDescription