import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

// 간단한 인메모리 사용자 저장소 (실제로는 서버/DB 사용)
const users: { [email: string]: { password: string; user: User } } = {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // 실제로는 API 호출
        const userData = users[email]
        if (userData && userData.password === password) {
          set({ user: userData.user, isAuthenticated: true })
          return true
        }
        return false
      },
      register: async (email, password, name) => {
        // 실제로는 API 호출
        if (users[email]) {
          return false // 이미 존재하는 이메일
        }
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
        }
        users[email] = { password, user: newUser }
        set({ user: newUser, isAuthenticated: true })
        return true
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      updateUser: (updatedUser) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedUser } })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
