import React, { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Product } from "../../../../types/Products.interface"
import { ReviewsSection } from "./components/ReviewSection"
import { ProductImage } from "./components/ProductImage"
import { ProductDetails } from "./components/ProductDetails"


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
                    _id: productId || "",
                    name: "Gold Chain",
                    slug: "gold-chain",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    category: "Gold",
                    subCategory: "Chains",
                    variants: [{
                        sku: "GC001",
                        price: 1425.0,
                        wt: 45,
                        unit: "grams",
                        totalStock: 25,
                        usedStock: 0,
                        remainingStock: 25,
                        reorderPoint: 10,
                        isActive: true
                    }],
                    makingCharges: 200,
                    rhodoumFinishes: false,
                    quantity: 1,
                    tags: ["Best Seller", "Featured", "New Arrival"],
                    visibleAs: "featured",
                    images: [
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                        "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                    ],
                    averageRating: 4.5,
                    numberOfReviews: 273,
                    isActive: true,
                    isFeatured: true,
                    // Legacy properties for backward compatibility
                    id: productId || "",
                    title: "Gold Chain",
                    price: 1425.0,
                    originalPrice: 1450.0,
                    rating: 4.5,
                    onSale: true,
                    image: "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
                    status: "On Stock",
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


export default ProductDescription