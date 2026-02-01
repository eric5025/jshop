'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { Address } from '@/types'
// 토스페이먼츠는 CDN을 통해 로드됩니다
declare global {
  interface Window {
    PaymentWidget: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { createOrder, updateOrderStatus } = useOrderStore()

  const [shippingAddress, setShippingAddress] = useState<Address>({
    postalCode: '',
    address: '',
    detailAddress: '',
    recipient: user?.name || '',
    phone: user?.phone || '',
  })

  const [paymentWidget, setPaymentWidget] = useState<any>(null)
  const [paymentMethodsWidget, setPaymentMethodsWidget] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const paymentWidgetRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const initPaymentWidget = async () => {
      try {
        // 토스페이먼츠 스크립트 로드
        if (!window.PaymentWidget) {
          const script = document.createElement('script')
          script.src = 'https://js.tosspayments.com/v1/payment-widget'
          script.async = true
          document.head.appendChild(script)

          await new Promise((resolve) => {
            script.onload = resolve
          })
        }

        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || 'test_ck_DpexMgkW36PvLwK6K3x0l2E6bBgN'
        
        // 결제 위젯 초기화
        const widget = window.PaymentWidget(clientKey, {
          customerKey: user?.id || 'anonymous',
        })

        setPaymentWidget(widget)

        // 결제 수단 위젯 렌더링
        const methodsWidget = widget.renderPaymentMethods(
          '#payment-method',
          { value: getTotalPrice() + (getTotalPrice() >= 50000 ? 0 : 3000) },
          { variantKey: 'DEFAULT' }
        )

        // 이용약관 위젯 렌더링
        widget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })

        setPaymentMethodsWidget(methodsWidget)
      } catch (error) {
        console.error('Payment widget initialization error:', error)
      }
    }

    if (isAuthenticated && user && items.length > 0) {
      initPaymentWidget()
    }
  }, [isAuthenticated, user, items.length, getTotalPrice])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 주소 검증
    if (
      !shippingAddress.postalCode ||
      !shippingAddress.address ||
      !shippingAddress.detailAddress ||
      !shippingAddress.recipient ||
      !shippingAddress.phone
    ) {
      alert('배송 정보를 모두 입력해주세요.')
      setIsLoading(false)
      return
    }

    try {
      // 주문 생성
      const order = createOrder(user.id, items, shippingAddress)
      const orderName = items.length === 1 
        ? items[0].product.name 
        : `${items[0].product.name} 외 ${items.length - 1}개`

      // 결제 요청
      if (!paymentWidget) {
        alert('결제 위젯이 초기화되지 않았습니다.')
        setIsLoading(false)
        return
      }

      await paymentWidget.requestPayment({
        orderId: order.orderNumber,
        orderName,
        customerName: shippingAddress.recipient,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payments/success?orderId=${order.id}`,
        failUrl: `${window.location.origin}/payments/fail?orderId=${order.id}`,
      })
    } catch (error: any) {
      console.error('Payment error:', error)
      alert('결제 요청 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'))
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문하기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
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

            <button
              type="submit"
              disabled={isLoading || !paymentWidget}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '결제 진행 중...' : '결제하기'}
            </button>
          </form>

          {/* 결제 위젯 영역 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">결제 수단</h2>
            <div id="payment-method" className="mb-4"></div>
            <div id="agreement"></div>
          </div>
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
