import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, size, color) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
        )

        if (existingItemIndex >= 0) {
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          set({
            items: [...items, { product, quantity, selectedSize: size, selectedColor: color }],
          })
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
          ),
        })
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }
        const items = get().items.map((item) =>
          item.product.id === productId && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity }
            : item
        )
        set({ items })
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
