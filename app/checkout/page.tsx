'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { Address } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { createOrder } = useOrderStore()

  const [shippingAddress, setShippingAddress] = useState<Address>({
    postalCode: '',
    address: '',
    detailAddress: '',
    recipient: user?.name || '',
    phone: user?.phone || '',
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
      return
    }
  }, [isAuthenticated, user, items.length, router])

  if (!isAuthenticated || !user || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalTotal = totalPrice + shippingFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 주소 검증
    if (
      !shippingAddress.postalCode ||
      !shippingAddress.address ||
      !shippingAddress.detailAddress ||
      !shippingAddress.recipient ||
      !shippingAddress.phone
    ) {
      alert('배송 정보를 모두 입력해주세요.')
      return
    }

    // 주문 생성 (결제는 제외)
    const order = createOrder(user.id, items, shippingAddress)
    clearCart()
    router.push(`/orders/${order.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문하기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">배송 정보</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                받는 분 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shippingAddress.recipient}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, recipient: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="010-1234-5678"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  우편번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="12345"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="서울시 강남구..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shippingAddress.detailAddress}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, detailAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="아파트/동/호수"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ 결제 시스템은 아직 구현되지 않았습니다. 주문 정보만 저장됩니다.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              주문 완료하기
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">주문 요약</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} ({item.selectedSize}, {item.selectedColor}) x {item.quantity}
                  </span>
                  <span>{(item.product.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600">무료</span>
                  ) : (
                    `${shippingFee.toLocaleString()}원`
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-primary-600">{finalTotal.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
