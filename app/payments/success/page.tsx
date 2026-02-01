'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useOrderStore } from '@/store/orderStore'
import { FiCheckCircle } from 'react-icons/fi'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getOrder, updateOrderStatus, updatePaymentInfo } = useOrderStore()
  const [isProcessing, setIsProcessing] = useState(true)

  const orderId = searchParams.get('orderId')
  const paymentKey = searchParams.get('paymentKey')
  const amount = searchParams.get('amount')

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderId || !paymentKey || !amount) {
        setIsProcessing(false)
        return
      }

      try {
        // 서버에서 결제 확인
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId: orderId,
            amount: parseInt(amount),
          }),
        })

        const data = await response.json()

        if (data.success) {
          // 주문 상태 및 결제 정보 업데이트
          const order = getOrder(orderId)
          if (order) {
            updatePaymentInfo(orderId, paymentKey, data.payment?.method || '카드')
          }
        } else {
          console.error('Payment confirmation failed:', data.error)
        }
      } catch (error) {
        console.error('Payment confirmation error:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    confirmPayment()
  }, [orderId, paymentKey, amount, getOrder, updatePaymentInfo])

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인하는 중입니다...</p>
        </div>
      </div>
    )
  }

  const order = orderId ? getOrder(orderId) : null

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다!</h1>
        <p className="text-gray-600 mb-6">
          주문이 성공적으로 완료되었습니다.
        </p>
        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">주문번호</p>
            <p className="font-semibold">{order.orderNumber}</p>
            <p className="text-sm text-gray-600 mb-1 mt-3">결제금액</p>
            <p className="font-semibold text-primary-600">
              {order.totalAmount.toLocaleString()}원
            </p>
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/orders/${orderId}`)}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => router.push('/products')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인하는 중입니다...</p>
        </div>
      </div>
    )
  }

  const order = orderId ? getOrder(orderId) : null

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다!</h1>
        <p className="text-gray-600 mb-6">
          주문이 성공적으로 완료되었습니다.
        </p>
        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">주문번호</p>
            <p className="font-semibold">{order.orderNumber}</p>
            <p className="text-sm text-gray-600 mb-1 mt-3">결제금액</p>
            <p className="font-semibold text-primary-600">
              {order.totalAmount.toLocaleString()}원
            </p>
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/orders/${orderId}`)}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => router.push('/products')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}
