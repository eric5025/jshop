'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiXCircle } from 'react-icons/fi'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('orderId')
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">결제에 실패했습니다</h1>
        <p className="text-gray-600 mb-6">
          {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
        </p>
        {errorCode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">에러 코드</p>
            <p className="font-semibold">{errorCode}</p>
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            장바구니로 돌아가기
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

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  )
}
