'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isAdmin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated && isAdmin) {
    router.push('/admin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(email, password)
    if (success) {
      const { isAdmin: adminCheck } = useAuthStore.getState()
      if (adminCheck) {
        router.push('/admin')
      } else {
        setError('관리자 권한이 없습니다.')
        useAuthStore.getState().logout()
      }
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-600">
          관리자 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">기본 관리자 계정:</p>
          <p className="text-xs">이메일: admin@shop.com</p>
          <p className="text-xs">비밀번호: admin123</p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="text-primary-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
