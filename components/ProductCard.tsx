'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { FiStar, FiShoppingCart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1, selectedSize, selectedColor)
    alert('장바구니에 추가되었습니다!')
  }

  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 text-xs font-semibold rounded">
              인기상품
            </span>
          )}
          {discountRate > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {discountRate}% 할인
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-500">
            <FiStar className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
          </div>
          <span className="ml-2 text-sm text-gray-500">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {product.price.toLocaleString()}원
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleQuickAdd}
          className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <FiShoppingCart className="w-4 h-4" />
          <span>장바구니 담기</span>
        </button>
      </div>
    </div>
  )
}
