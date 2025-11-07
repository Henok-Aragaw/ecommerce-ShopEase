export interface Product {
    reviews: { rating: number; comment: string; date: string; reviewerName: string; reviewerEmail: string }[]
    shippingInformation: ReactNode
    returnPolicy: ReactNode
    warrantyInformation: ReactNode
    availabilityStatus: ReactNode
    dimensions: { width: number; height: number; depth: number }
    
    weight: ReactNode
    sku: ReactNode
    id?: number
    title: string
    description?: string
    price: number
    discountPercentage?: number
    rating?: number
    stock?: number
    brand?: string
    category?: string
    thumbnail?: string
    images?: string[]
}