'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'

export default function AdminHeroPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const { heroImage, setHeroImage } = useSettingsStore()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setHeroImage(data.url)
        alert('히어로 이미지가 업데이트되었습니다!')
      } else {
        alert(data.error || '파일 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">히어로 이미지 관리</h1>
        <p className="text-gray-600">홈페이지 메인 배경 이미지를 변경할 수 있습니다.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* 현재 이미지 미리보기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 히어로 이미지
            </label>
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-300">
              <Image
                src={heroImage}
                alt="현재 히어로 이미지"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 이미지 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={uploading}
            />
            {uploading && (
              <p className="mt-2 text-sm text-gray-600">업로드 중...</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              권장 크기: 1920x500px 이상 (가로형 이미지)
            </p>
          </div>

          {/* 이미지 URL 직접 입력 (선택사항) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              또는 이미지 URL 직접 입력
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    setHeroImage(e.target.value.trim())
                  }
                }}
                defaultValue={heroImage}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="url"]') as HTMLInputElement
                  if (input?.value.trim()) {
                    setHeroImage(input.value.trim())
                    alert('히어로 이미지가 업데이트되었습니다!')
                  }
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← 대시보드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
