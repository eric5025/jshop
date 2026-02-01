import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export default function Home() {
  const featuredProducts = products.filter((p) => p.featured)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              새로운 시즌의 트렌드를 만나보세요
            </h1>
            <p className="text-xl mb-8">
              세련되고 스타일리시한 여성의류 컬렉션
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              쇼핑하기
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">인기 상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            전체 상품 보기
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['아우터', '가디건', '티셔츠', '팬츠', '스커트', '원피스'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow hover:text-primary-600"
              >
                <div className="text-2xl font-semibold">{category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
