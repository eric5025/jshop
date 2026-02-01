'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { useProductStore } from '@/store/productStore'
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, user } = useAuthStore()
  const { orders } = useOrderStore()
  const { products } = useProductStore()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const totalOrders = orders.length
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const totalProducts = products.length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const stats = [
    {
      title: '총 주문',
      value: totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: '대기 주문',
      value: pendingOrders,
      icon: FiPackage,
      color: 'bg-yellow-500',
      link: '/admin/orders?status=pending',
    },
    {
      title: '총 매출',
      value: `${totalRevenue.toLocaleString()}원`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: '상품 수',
      value: totalProducts,
      icon: FiPackage,
      color: 'bg-purple-500',
      link: '/admin/products',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-gray-600">환영합니다, {user?.name}님</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 빠른 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">상품 관리</h2>
          <p className="text-gray-600">상품 등록, 수정, 삭제</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">주문 관리</h2>
          <p className="text-gray-600">주문 조회 및 상태 관리</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">사용자 관리</h2>
          <p className="text-gray-600">사용자 조회 및 관리</p>
        </Link>

        <Link
          href="/admin/hero"
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">히어로 이미지 관리</h2>
          <p className="text-gray-600">홈페이지 메인 배경 이미지 변경</p>
        </Link>
      </div>
    </div>
  )
}
