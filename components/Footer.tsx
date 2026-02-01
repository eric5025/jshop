import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">여성의류</h3>
            <p className="text-gray-400">
              트렌디하고 세련된 여성의류를 제공하는 쇼핑몰입니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객센터</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/faq" className="hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  배송안내
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">회사정보</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>1588-0000</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>github.com/eric5025</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiMapPin className="w-4 h-4 mt-1" />
                <span>서울시 강남구 테헤란로 123</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 여성의류 쇼핑몰. All rights reserved | github.com/eric5025</p>
        </div>
      </div>
    </footer>
  )
}
