import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'
import { products as initialProducts } from '@/data/products'

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
        }
        set({ products: [...get().products, newProduct] })
      },
      updateProduct: (id, productData) => {
        set({
          products: get().products.map((product) =>
            product.id === id ? { ...product, ...productData } : product
          ),
        })
      },
      deleteProduct: (id) => {
        set({
          products: get().products.filter((product) => product.id !== id),
        })
      },
      getProduct: (id) => {
        return get().products.find((product) => product.id === id)
      },
    }),
    {
      name: 'product-storage',
    }
  )
)
