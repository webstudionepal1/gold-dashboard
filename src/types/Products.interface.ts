export interface Product {
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