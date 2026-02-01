# 빠른 Vercel 배포 가이드

## 가장 빠른 방법: Vercel CLI 사용

### 1단계: Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인 (브라우저가 자동으로 열림)
vercel login
```

### 2단계: 프로젝트 배포

프로젝트 루트 디렉토리(`c:\shop1`)에서 실행:

```bash
# 개발 환경 배포 (프리뷰)
vercel

# 프로덕션 배포
vercel --prod
```

### 3단계: 완료!

배포가 완료되면 URL이 표시됩니다:
- 예: `https://women-fashion-shop-xxx.vercel.app`

---

## Git 저장소와 연결하는 방법 (자동 배포)

### 1단계: Git 초기화

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2단계: GitHub에 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. "New repository" 클릭
3. 저장소 이름 입력 (예: `women-fashion-shop`)
4. "Create repository" 클릭

### 3단계: GitHub에 푸시

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 4단계: Vercel 웹에서 연결

1. [vercel.com](https://vercel.com) 접속
2. GitHub로 로그인
3. "Add New Project" 클릭
4. 방금 만든 저장소 선택
5. "Deploy" 클릭

이제 `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다!

---

## 현재 프로젝트 상태

✅ Next.js 14.2.35 설정 완료
✅ 빌드 성공 확인 완료
✅ Vercel 설정 파일 준비 완료
✅ 모든 페이지 정상 작동

바로 배포 가능합니다!
