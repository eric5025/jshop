# 여성의류 쇼핑몰

Next.js와 Vercel을 사용하여 구축한 여성의류 쇼핑몰 프로젝트입니다.

## 주요 기능

- ✅ 상품 목록 및 상세 페이지
- ✅ 상품 검색 및 카테고리 필터링
- ✅ 장바구니 기능
- ✅ 사용자 인증 (로그인/회원가입)
- ✅ 주문 관리 시스템 (결제 제외)
- ✅ 반응형 디자인
- ✅ 주문 내역 조회

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **아이콘**: React Icons
- **배포**: Vercel

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
shop1/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 메인 페이지
│   ├── products/          # 상품 관련 페이지
│   ├── cart/              # 장바구니 페이지
│   ├── login/             # 로그인/회원가입 페이지
│   ├── checkout/          # 주문 페이지
│   └── orders/            # 주문 내역 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── store/                 # Zustand 상태 관리
│   ├── cartStore.ts
│   ├── authStore.ts
│   └── orderStore.ts
├── data/                  # 샘플 데이터
│   └── products.ts
└── types/                 # TypeScript 타입 정의
    └── index.ts
```

## 주요 기능 설명

### 상품 관리
- 상품 목록 조회
- 상품 상세 정보
- 카테고리별 필터링
- 검색 기능
- 가격 정렬

### 장바구니
- 상품 추가/삭제
- 수량 조절
- 사이즈 및 색상 선택
- 총 금액 계산

### 사용자 인증
- 회원가입
- 로그인/로그아웃
- 세션 관리 (로컬 스토리지)

### 주문 관리
- 주문 생성 (결제 제외)
- 주문 내역 조회
- 주문 상세 정보
- 배송 정보 입력

## 주의사항

⚠️ **결제 시스템은 아직 구현되지 않았습니다.** 주문 정보만 저장되며 실제 결제는 진행되지 않습니다.

## 배포

Vercel에 배포하려면:

1. GitHub에 프로젝트를 푸시합니다
2. [Vercel](https://vercel.com)에 로그인합니다
3. 새 프로젝트를 생성하고 GitHub 저장소를 연결합니다
4. 자동으로 배포가 진행됩니다

또는 Vercel CLI를 사용할 수 있습니다:

```bash
npm i -g vercel
vercel
```

## 라이선스

MIT
