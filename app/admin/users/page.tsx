'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'

export default function AdminUsersPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const { orders } = useOrderStore()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // 실제로는 서버에서 사용자 목록을 가져와야 하지만, 여기서는 주문 데이터에서 사용자 정보를 추출
  const userMap = new Map<string, { user: any; orderCount: number; totalSpent: number }>()
  
  orders.forEach((order) => {
    if (!userMap.has(order.userId)) {
      userMap.set(order.userId, {
        user: { id: order.userId, name: '사용자', email: `${order.userId}@example.com` },
        orderCount: 0,
        totalSpent: 0,
      })
    }
    const userData = userMap.get(order.userId)!
    userData.orderCount += 1
    if (order.paymentStatus === 'paid') {
      userData.totalSpent += order.totalAmount
    }
  })

  const users = Array.from(userMap.values())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">사용자 관리</h1>
        <p className="text-gray-600">총 {users.length}명의 사용자</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총 구매액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    사용자 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData.user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userData.user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userData.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.orderCount}건
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userData.totalSpent.toLocaleString()}원
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← 대시보드로 돌아가기
        </Link>
      </div>
    </div>
  )
}
