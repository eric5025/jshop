import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

// 간단한 인메모리 사용자 저장소 (실제로는 서버/DB 사용)
const users: { [email: string]: { password: string; user: User } } = {}

// 기본 관리자 계정 생성 (실제로는 DB에서 관리)
const adminEmail = 'admin@shop.com'
const adminPassword = 'admin123'
if (!users[adminEmail]) {
  users[adminEmail] = {
    password: adminPassword,
    user: {
      id: 'admin-1',
      email: adminEmail,
      name: '관리자',
      role: 'admin',
    },
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email, password) => {
        // 실제로는 API 호출
        const userData = users[email]
        if (userData && userData.password === password) {
          set({ 
            user: userData.user, 
            isAuthenticated: true,
            isAdmin: userData.user.role === 'admin'
          })
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
          role: 'user',
        }
        users[email] = { password, user: newUser }
        set({ 
          user: newUser, 
          isAuthenticated: true,
          isAdmin: false
        })
        return true
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false })
      },
      updateUser: (updatedUser) => {
        const currentUser = get().user
        if (currentUser) {
          const updated = { ...currentUser, ...updatedUser }
          set({ 
            user: updated,
            isAdmin: updated.role === 'admin'
          })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
