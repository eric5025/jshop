'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/productStore'
import { categories } from '@/data/products'
import { Product } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const { products } = useProductStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'newest'>('newest')

  const searchQuery = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category')

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered: Product[] = [...products]

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
        default:
          return 0
      }
    })

    return sorted
  }, [products, searchQuery, selectedCategory, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 목록</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            정렬
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="newest">최신순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
            <option value="rating">평점 높은순</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        총 {filteredAndSortedProducts.length}개의 상품
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
