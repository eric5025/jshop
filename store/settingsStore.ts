import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  heroImage: string
  setHeroImage: (url: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      heroImage: '/hero-image.jpg',
      setHeroImage: (url) => set({ heroImage: url }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
