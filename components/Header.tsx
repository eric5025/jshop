'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiShoppingBag, FiUser, FiSearch, FiMenu } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Header() {
  const router = useRouter()
  const { getTotalItems } = useCartStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const totalItems = getTotalItems()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            여성의류
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품 검색..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-primary-600">
              상품
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="text-gray-700 hover:text-primary-600">
                  주문내역
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{user?.name}님</span>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-primary-600">
                로그인
              </Link>
            )}
            <Link href="/cart" className="relative">
              <FiShoppingBag className="w-6 h-6 text-gray-700 hover:text-primary-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-700"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품 검색..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-r-lg"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setShowMobileMenu(false)}
              >
                상품
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    주문내역
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{user?.name}님</span>
                    <button
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className="text-gray-700 hover:text-primary-600"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  로그인
                </Link>
              )}
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                onClick={() => setShowMobileMenu(false)}
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>장바구니 {totalItems > 0 && `(${totalItems})`}</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
