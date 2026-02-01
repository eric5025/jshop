export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  rating: number
  reviewCount: number
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: Address
}

export interface Address {
  postalCode: string
  address: string
  detailAddress: string
  recipient: string
  phone: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  shippingAddress: Address
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
  createdAt: string
  orderNumber: string
}
