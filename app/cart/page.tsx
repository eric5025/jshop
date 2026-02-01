'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const totalPrice = getTotalPrice()
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalTotal = totalPrice + shippingFee

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }
    if (items.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">장바구니가 비어있습니다.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            쇼핑하러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="128px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>사이즈: {item.selectedSize}</p>
                  <p>색상: {item.selectedColor}</p>
                  <p className="text-primary-600 font-semibold">
                    {(item.product.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() =>
                    removeItem(item.product.id, item.selectedSize, item.selectedColor)
                  }
                  className="text-red-500 hover:text-red-700 mb-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity - 1
                      )
                    }
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">주문 요약</h2>
            <div className="space-y-3 mb-4">
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
              {totalPrice < 50000 && (
                <p className="text-sm text-gray-500">
                  {50000 - totalPrice > 0 && (
                    <>{(50000 - totalPrice).toLocaleString()}원 더 구매 시 무료배송</>
                  )}
                </p>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-primary-600">{finalTotal.toLocaleString()}원</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-3"
            >
              주문하기
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
    </div>
  )
}
