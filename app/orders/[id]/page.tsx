'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiArrowLeft } from 'react-icons/fi'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { getOrder } = useOrderStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const order = getOrder(params.id as string)

  if (!order || order.userId !== user.id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">주문을 찾을 수 없습니다.</p>
        <Link
          href="/orders"
          className="inline-block mt-4 text-primary-600 hover:underline"
        >
          주문 내역으로 돌아가기
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiPackage className="w-6 h-6" />
      case 'confirmed':
        return <FiCheckCircle className="w-6 h-6 text-blue-500" />
      case 'shipping':
        return <FiTruck className="w-6 h-6 text-yellow-500" />
      case 'delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled':
        return <FiXCircle className="w-6 h-6 text-red-500" />
      default:
        return <FiPackage className="w-6 h-6" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '주문 대기'
      case 'confirmed':
        return '주문 확인'
      case 'shipping':
        return '배송 중'
      case 'delivered':
        return '배송 완료'
      case 'cancelled':
        return '주문 취소'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="w-5 h-5 mr-2" />
        주문 내역으로 돌아가기
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">주문 상세</h1>
            <p className="text-gray-600">주문번호: {order.orderNumber}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(order.status)}
              <span className={`text-lg font-semibold ${
                order.status === 'delivered'
                  ? 'text-green-600'
                  : order.status === 'cancelled'
                  ? 'text-red-600'
                  : order.status === 'shipping'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              주문일: {new Date(order.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">주문 상품</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      사이즈: {item.selectedSize} | 색상: {item.selectedColor}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">수량: {item.quantity}개</p>
                    <p className="text-primary-600 font-semibold">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">주문 요약</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>상품 금액</span>
                <span>{order.totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span className="text-green-600">무료</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-primary-600">{order.totalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">배송 정보</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">받는 분:</span> {order.shippingAddress.recipient}
              </p>
              <p>
                <span className="font-semibold">연락처:</span> {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-semibold">주소:</span> [{order.shippingAddress.postalCode}]{' '}
                {order.shippingAddress.address} {order.shippingAddress.detailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
