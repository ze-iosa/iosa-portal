# IOSA 관리 포털 — IT 인수인계 문서

작성일: 2026-05-22  
작성 부서: 안전보안실

---

## 1. 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | IOSA 관리 포털 |
| **운영사** | 이스타항공 (ZE / ESR) |
| **목적** | IOSA 심사 준비·이력·CAP/FAT 현황을 한 곳에서 관리 |
| **접근 방식** | 순수 정적 웹(Static Web) — 별도 서버·DB 없음 |
| **배포 방법** | GitHub Pages (무료, 자동 배포) |
| **저장소** | https://github.com/ze-iosa/iosa-portal |
| **접속 URL** | https://ze-iosa.github.io/iosa-portal |

---

## 2. 기술 스택

```
프론트엔드만 존재 (백엔드/서버/DB 없음)
├── HTML5          index.html (2,920줄) — 전체 화면 템플릿·데이터 내장
├── CSS            css/styles.css (951줄) — 커스텀 스타일
├── JavaScript
│   ├── js/app.js  (4,654줄) — 전체 앱 로직·렌더링
│   └── js/data.js — 초기 데이터 시드
└── 외부 CDN (인터넷 필요)
    ├── Bootstrap 5.3.2  — 레이아웃·모달
    ├── Font Awesome 6.5 — 아이콘
    └── SheetJS (xlsx)   — 엑셀 내보내기
```

**데이터 저장소**: `localStorage` (브라우저 내장)
- 서버 없이 각 사용자 브라우저에 저장됨
- 다른 PC·브라우저에서 열면 데이터가 공유되지 않음 ⚠️

---

## 3. 파일 구조

```
IOSA_Portal/
├── index.html              ← 진입점 (모든 페이지 포함, SPA)
├── css/
│   └── styles.css          ← 커스텀 스타일
├── js/
│   ├── app.js              ← 메인 앱 로직 (렌더링, 라우팅, 저장)
│   ├── data.js             ← 초기 데이터 시드
│   └── ism18_isarps.js     ← ISM Ed.18 ISARP 목록 데이터
├── assets/
│   ├── iata_logo_blue.png
│   ├── iata_logo_white.png
│   └── iosa_stamp.png
├── IT_인수인계_문서.md      ← 본 문서
└── .gitignore
```

---

## 4. 주요 기능 (탭별)

| 탭 | 기능 |
|-----|------|
| **대시보드** | 인증 현황·주요 지표·일정 타임라인 요약 |
| **심사 이력** | 연도별 심사 결과 / AUDITOR LIST / Total F·OBS / 다부문·단독 Finding 아코디언 / 개별 상세 패널 |
| **CR 작성** | 부문별(ORG·FLT·MNT·DSP·CAB·GRH·CGO·SEC) Conformance Report 작성, 연계 ISARP 표시 |
| **심사원 관리** | 심사원 발령·외부교육·교육자료·전파교육 CRUD (추가·수정·삭제) |
| **일정 관리** | IOSA 준비 일정 타임라인 |
| **커뮤니티** | 부문별 게시판 |

---

## 5. 로그인 / 권한 구조

| 구분 | 계정 | 권한 |
|------|------|------|
| **관리자** | 안전보안실 계정 | 전체 편집·삭제·관리자 전용 UI 표시 |
| **일반 사용자** | 부문별 계정 | 자기 부문 데이터만 조회·작성 |

- 로그인 정보는 `localStorage`에 저장 (실제 인증 서버 없음)
- 비밀번호 변경 시 `js/app.js` 내 사용자 목록 직접 수정 필요

### 계정 수정 위치

`js/app.js` 상단 사용자 목록 배열에서 직접 편집:

```javascript
const USERS = [
  { id: 'admin', pw: '****', dept: '안전보안실', role: 'admin' },
  { id: 'flt',   pw: '****', dept: '운항본부',   role: 'user'  },
  // ...
];
```

---

## 6. 배포 방법 (GitHub Pages)

### 코드 수정 후 배포 절차

```bash
# 1. 로컬에서 파일 수정
# 2. 변경 내용 저장
git add .
git commit -m "변경 내용 설명"

# 3. GitHub에 push → 자동 배포 (1~2분 소요)
git push origin main
```

- 별도 빌드 도구(webpack 등) 없음 — push하면 즉시 배포
- GitHub 저장소: https://github.com/ze-iosa/iosa-portal
- GitHub 조직 계정(`ze-iosa`) 접근 권한 필요

### 캐시 문제 발생 시

`index.html` 에서 버전 숫자를 변경하면 브라우저 캐시가 갱신됨:

```html
<link href="css/styles.css?v=20250522a" rel="stylesheet">
<script src="js/app.js?v=20250522b"></script>
```

`20250522a` → `20250522c` 등 임의 버전으로 변경 후 push

---

## 7. 데이터 관리 주의사항

| 사항 | 내용 |
|------|------|
| **데이터 위치** | 각 브라우저 localStorage (서버 DB 없음) |
| **데이터 공유** | PC 간 자동 공유 안 됨 |
| **데이터 초기화** | 브라우저 캐시 삭제 시 데이터 소멸 |
| **Finding 데이터** | `index.html` 내 `keyCARs` 배열에 하드코딩 |
| **백업** | 현재 별도 백업 기능 없음 |

### Finding 데이터 수정 위치

`index.html` 내 `keyCARs` 배열 (약 1,002번째 줄):

```javascript
keyCARs: [
  { id:'93285', isarp:'ORG 1.5.3', sect:'ORG',
    desc:'안전관리 목표 및 성과지표 문서화 미흡',
    capPlan:'...', fatContent:'...', status:'closed' },
  // ...
]
```

---

## 8. 주요 함수 / 코드 위치 안내

| 기능 | 파일 | 함수명 |
|------|------|--------|
| 페이지 라우팅 | js/app.js | `navigate(tab)` |
| 심사 이력 렌더링 | index.html | `renderHistoryContent()` |
| CR 작성 렌더링 | js/app.js | `_renderCRContent()` |
| 심사원 관리 렌더링 | js/app.js | `renderPreparation()` |
| 로그인 처리 | js/app.js | `doLogin()` |
| 데이터 저장 | js/app.js | `DB.save()` |
| Finding 상세 패널 | index.html | `openFindingDetail(id)` |
| 심사원 저장 | js/app.js | `auditorSave(year)` |

---

## 9. 향후 개선 권고사항

| 우선순위 | 항목 | 이유 |
|----------|------|------|
| 높음 | **백엔드 DB 연동** | localStorage는 브라우저 종속 → 공유·백업 불가 |
| 높음 | **실제 인증 시스템** | 현재 로그인은 프론트엔드 로직만 존재 (보안 취약) |
| 중간 | **데이터 가져오기(Import)** | 엑셀 export는 있으나 import 없음 |
| 중간 | **모바일 최적화** | 현재 데스크탑 위주 설계 |
| 낮음 | **알림 기능** | CAP 마감일 등 이메일·슬랙 알림 연동 |

---

## 10. 인수인계 체크리스트

- [ ] GitHub 저장소(`ze-iosa`) IT팀 계정 초대 완료
- [ ] 접속 URL 정상 확인: https://ze-iosa.github.io/iosa-portal
- [ ] 관리자 계정 비밀번호 변경 완료
- [ ] 부문별 계정 비밀번호 배포 완료
- [ ] 로컬 개발 환경 설정 안내 완료 (git clone 후 브라우저로 바로 열기)
- [ ] 데이터 백업 정책 수립

---

**콘텐츠·데이터 문의**: 안전보안실  
**코드·서버 문의**: IT운영팀  
**GitHub 저장소**: https://github.com/ze-iosa/iosa-portal
