'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isAuthenticated } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const success = await login(email, password)
      if (success) {
        router.push('/')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } else {
      if (!name.trim()) {
        setError('이름을 입력해주세요.')
        return
      }
      const success = await register(email, password, name)
      if (success) {
        router.push('/')
      } else {
        setError('이미 존재하는 이메일입니다.')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isLogin ? '로그인' : '회원가입'}
        </h1>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={`flex-1 py-2 text-center font-semibold ${
              isLogin
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
            className={`flex-1 py-2 text-center font-semibold ${
              !isLogin
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required={!isLogin}
              />
            </div>
          )}

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
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/products" className="text-primary-600 hover:underline">
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  )
}
