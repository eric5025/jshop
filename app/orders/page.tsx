'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi'

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { getUserOrders } = useOrderStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const orders = getUserOrders(user.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiPackage className="w-5 h-5" />
      case 'confirmed':
        return <FiCheckCircle className="w-5 h-5 text-blue-500" />
      case 'shipping':
        return <FiTruck className="w-5 h-5 text-yellow-500" />
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />
      default:
        return <FiPackage className="w-5 h-5" />
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">주문 내역</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">주문 내역이 없습니다.</p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-lg">{order.orderNumber}</span>
                </div>
                <p className="text-sm text-gray-500">
                  주문일: {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <div className="text-lg font-bold text-primary-600 mb-1">
                  {order.totalAmount.toLocaleString()}원
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : order.status === 'shipping'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">
                배송지: {order.shippingAddress.address} {order.shippingAddress.detailAddress}
              </p>
              <p className="text-sm text-gray-600">
                상품 {order.items.length}개
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
