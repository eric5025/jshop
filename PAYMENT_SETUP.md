# 결제 시스템 설정 가이드

토스페이먼츠를 사용한 결제 시스템이 구현되었습니다.

## 1. 토스페이먼츠 계정 생성 및 키 발급

1. [토스페이먼츠](https://www.toss.im/payments) 접속
2. 회원가입 및 로그인
3. "내 상점" → "개발" 메뉴에서 테스트 키 확인
4. 프로덕션 환경에서는 "운영" 메뉴에서 실제 키 발급

## 2. 환경 변수 설정

### 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 테스트 키 (개발용)
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_DpexMgkW36PvLwK6K3x0l2E6bBgN
TOSS_PAYMENTS_SECRET_KEY=test_sk_DpexMgkW36PvLwK6K3x0l2E6bBgN
```

**중요**: 
- `NEXT_PUBLIC_` 접두사가 붙은 키는 클라이언트에서 사용됩니다 (브라우저에 노출됨)
- `TOSS_PAYMENTS_SECRET_KEY`는 서버에서만 사용됩니다 (절대 클라이언트에 노출되면 안 됨)

### Vercel 배포 환경

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:
   - `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`: 클라이언트 키
   - `TOSS_PAYMENTS_SECRET_KEY`: 시크릿 키
4. 각 환경(Production, Preview, Development)에 설정
5. 재배포

## 3. 테스트 결제

### 테스트 카드 정보

토스페이먼츠 테스트 환경에서는 다음 카드 정보를 사용할 수 있습니다:

- **카드번호**: 4242 4242 4242 4242
- **유효기간**: 12/34
- **CVC**: 123
- **비밀번호**: 12** (앞 2자리)

### 테스트 시나리오

1. 상품을 장바구니에 추가
2. 장바구니에서 "주문하기" 클릭
3. 배송 정보 입력
4. 결제 수단 선택 (카드, 계좌이체 등)
5. 테스트 카드 정보 입력
6. 결제 완료

## 4. 결제 흐름

1. **주문 생성**: 사용자가 배송 정보를 입력하고 "결제하기" 클릭
2. **결제 위젯 표시**: 토스페이먼츠 결제 위젯이 표시됨
3. **결제 요청**: 사용자가 결제 정보 입력 후 결제 진행
4. **결제 확인**: 서버에서 결제 검증 (`/api/payments/confirm`)
5. **주문 완료**: 결제 성공 시 주문 상태가 'confirmed'로 변경

## 5. 주요 파일

- `app/checkout/page.tsx`: 결제 페이지 (토스페이먼츠 위젯 통합)
- `app/api/payments/confirm/route.ts`: 결제 확인 API (서버 사이드)
- `app/payments/success/page.tsx`: 결제 성공 페이지
- `app/payments/fail/page.tsx`: 결제 실패 페이지
- `store/orderStore.ts`: 주문 및 결제 상태 관리

## 6. 보안 주의사항

⚠️ **중요**: 
- `TOSS_PAYMENTS_SECRET_KEY`는 절대 클라이언트 코드에 포함하지 마세요
- 환경 변수로만 관리하고, `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
- 프로덕션 환경에서는 반드시 실제 키를 사용하세요

## 7. 문제 해결

### 결제 위젯이 표시되지 않는 경우

1. `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`가 올바르게 설정되었는지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. 네트워크 탭에서 API 호출 상태 확인

### 결제 확인 실패

1. `TOSS_PAYMENTS_SECRET_KEY`가 올바르게 설정되었는지 확인
2. 서버 로그 확인 (`/api/payments/confirm`)
3. 토스페이먼츠 대시보드에서 결제 내역 확인

## 8. 추가 기능

현재 구현된 기능:
- ✅ 카드 결제
- ✅ 계좌이체
- ✅ 가상계좌
- ✅ 결제 완료/실패 처리
- ✅ 주문 상태 업데이트

추가로 구현 가능한 기능:
- 환불 처리
- 결제 내역 조회
- 정기 결제
- 부분 결제

## 참고 자료

- [토스페이먼츠 개발자 문서](https://docs.tosspayments.com/)
- [토스페이먼츠 위젯 SDK](https://docs.tosspayments.com/guides/payment-widget/overview)
