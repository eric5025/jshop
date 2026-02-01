import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, CartItem, Address } from '@/types'

interface OrderStore {
  orders: Order[]
  createOrder: (userId: string, items: CartItem[], shippingAddress: Address) => Order
  getOrder: (orderId: string) => Order | undefined
  getUserOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (userId, items, shippingAddress) => {
        const totalAmount = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
        const orderNumber = `ORD-${Date.now()}`
        const newOrder: Order = {
          id: Date.now().toString(),
          userId,
          items,
          totalAmount,
          shippingAddress,
          status: 'pending',
          createdAt: new Date().toISOString(),
          orderNumber,
        }
        set({ orders: [...get().orders, newOrder] })
        return newOrder
      },
      getOrder: (orderId) => {
        return get().orders.find((order) => order.id === orderId)
      },
      getUserOrders: (userId) => {
        return get().orders.filter((order) => order.userId === userId)
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })
      },
    }),
    {
      name: 'order-storage',
    }
  )
)
