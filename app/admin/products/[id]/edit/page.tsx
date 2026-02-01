'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useProductStore } from '@/store/productStore'
import { categories } from '@/data/products'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const { getProduct, updateProduct } = useProductStore()
  const product = getProduct(params.id as string)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    rating: '0',
    reviewCount: '0',
    featured: false,
    images: [] as string[],
  })
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
      return
    }

    if (!product) {
      router.push('/admin/products')
      return
    }

    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      featured: product.featured || false,
      images: product.images,
    })
  }, [isAuthenticated, isAdmin, product, router])

  if (!isAuthenticated || !isAdmin || !product) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateProduct(params.id as string, {
      name: formData.name,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      description: formData.description,
      category: formData.category,
      sizes: formData.sizes,
      colors: formData.colors,
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating),
      reviewCount: parseInt(formData.reviewCount),
      featured: formData.featured,
      images: formData.images.filter((img) => img.trim() !== ''),
    })

    router.push('/admin/products')
  }

  const addSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, ''] })
  }

  const updateSize = (index: number, value: string) => {
    const newSizes = [...formData.sizes]
    newSizes[index] = value
    setFormData({ ...formData, sizes: newSizes })
  }

  const removeSize = (index: number) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) })
  }

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, ''] })
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = value
    setFormData({ ...formData, colors: newColors })
  }

  const removeColor = (index: number) => {
    setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) })
  }

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return

    setUploading({ ...uploading, [index]: true })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        updateImage(index, data.url)
      } else {
        alert(data.error || '파일 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading({ ...uploading, [index]: false })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품명 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                원가 (선택)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                재고 *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이즈 *
            </label>
            <div className="space-y-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => updateSize(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="예: S, M, L"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + 사이즈 추가
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              색상 *
            </label>
            <div className="space-y-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="예: 블랙, 화이트"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + 색상 추가
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 *
            </label>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(index, file)
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={uploading[index]}
                    />
                    {uploading[index] && (
                      <div className="flex items-center px-4 text-sm text-gray-600">
                        업로드 중...
                      </div>
                    )}
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt={`미리보기 ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + 이미지 추가
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
              인기 상품으로 표시
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            상품 수정
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
