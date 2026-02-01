# Vercel 배포 가이드

여성의류 쇼핑몰을 Vercel에 배포하는 방법입니다.

## 방법 1: Vercel 웹 대시보드 사용 (추천)

### 1단계: Git 저장소 준비

먼저 프로젝트를 Git 저장소에 푸시해야 합니다.

```bash
# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"

# GitHub/GitLab/Bitbucket에 저장소 생성 후
git remote add origin <저장소-URL>
git push -u origin main
```

### 2단계: Vercel에 프로젝트 연결

1. [Vercel 웹사이트](https://vercel.com)에 접속
2. "Sign Up" 또는 "Log In" 클릭 (GitHub 계정으로 로그인 권장)
3. 대시보드에서 "Add New..." → "Project" 클릭
4. Git 저장소 선택 (GitHub/GitLab/Bitbucket)
5. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)
   - **Install Command**: `npm install` (자동 설정됨)
6. "Deploy" 버튼 클릭

### 3단계: 배포 완료

배포가 완료되면 자동으로 URL이 생성됩니다:
- 프로덕션: `https://your-project-name.vercel.app`
- 프리뷰: 각 커밋마다 자동으로 프리뷰 URL 생성

## 방법 2: Vercel CLI 사용

### 1단계: Vercel CLI 설치

```bash
npm i -g vercel
```

### 2단계: 로그인

```bash
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인합니다.

### 3단계: 프로젝트 배포

```bash
# 프로젝트 루트 디렉토리에서
vercel
```

첫 배포 시 질문이 나옵니다:
- **Set up and deploy?** → `Y`
- **Which scope?** → 계정 선택
- **Link to existing project?** → `N` (새 프로젝트)
- **Project name?** → 프로젝트 이름 입력 (또는 Enter로 기본값)
- **Directory?** → `./` (Enter)
- **Override settings?** → `N` (기본 설정 사용)

### 4단계: 프로덕션 배포

```bash
vercel --prod
```

## 환경 변수 설정 (필요한 경우)

만약 나중에 환경 변수가 필요하다면:

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 변수 추가 후 "Save"
4. 재배포 필요

## 자동 배포 설정

Git 저장소와 연결하면:
- `main` 브랜치에 푸시 → 자동으로 프로덕션 배포
- 다른 브랜치에 푸시 → 자동으로 프리뷰 배포
- Pull Request 생성 → 자동으로 프리뷰 배포

## 현재 프로젝트 설정

`vercel.json` 파일에 이미 설정이 되어 있습니다:
- 빌드 명령: `npm run build`
- 개발 명령: `npm run dev`
- 프레임워크: Next.js
- 리전: 서울 (icn1)

## 문제 해결

### 빌드 실패 시

1. Vercel 대시보드 → Deployments → 실패한 배포 클릭
2. "Build Logs" 확인
3. 로컬에서 `npm run build` 실행하여 오류 확인

### 이미지 최적화 오류

`next.config.js`에 이미 이미지 도메인이 설정되어 있습니다:
- `images.unsplash.com`
- `via.placeholder.com`

다른 이미지 도메인을 사용하려면 `next.config.js`에 추가하세요.

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
