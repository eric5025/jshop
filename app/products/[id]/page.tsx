'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useProductStore } from '@/store/productStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi'
import { Product } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { products, getProduct } = useProductStore()
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const product = getProduct(params.id as string)

  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">상품을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('사이즈와 색상을 선택해주세요.')
      return
    }
    addItem(product, quantity, selectedSize, selectedColor)
    alert('장바구니에 추가되었습니다!')
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }
    if (!selectedSize || !selectedColor) {
      alert('사이즈와 색상을 선택해주세요.')
      return
    }
    addItem(product, quantity, selectedSize, selectedColor)
    router.push('/checkout')
  }

  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              <FiStar className="w-5 h-5 fill-current" />
              <span className="ml-1 text-lg font-semibold text-gray-700">
                {product.rating}
              </span>
            </div>
            <span className="ml-2 text-gray-500">({product.reviewCount}개 리뷰)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                {product.price.toLocaleString()}원
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()}원
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {discountRate}% 할인
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이즈 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              색상 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                    selectedColor === color
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수량
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
              <span className="text-gray-500">(재고: {product.stock}개)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              바로 구매하기
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>장바구니 담기</span>
            </button>
          </div>

          {/* Stock Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              재고 상태: <span className="font-semibold">{product.stock}개 남음</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
