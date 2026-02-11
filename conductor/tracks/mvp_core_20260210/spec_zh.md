# Track 規格說明書: MVP 核心基礎設施

## 1. 概述 (Overview)
本 Track 將建立 Agent 技能市集的基礎。重點在於優先建構前端「外殼」以供預覽，隨後再整合 Next.js 開發環境、PostgreSQL 資料庫（透過 Podman 運行）、Prisma 架構、Git OAuth 認證，並完成核心的「瀏覽」與「註冊技能」功能。

## 2. 技術需求 (Technical Requirements)
### 環境
- **Runtime:** Node.js (Latest LTS)
- **容器化:** Podman (用於本地 PostgreSQL 資料庫)
- **框架:** Next.js (App Router)
- **語言:** TypeScript
- **樣式:** Tailwind CSS + shadcn/ui

### 資料庫架構 (Prisma)
- **User:** `id`, `email`, `name`, `provider` (git), `createdAt`
- **Skill:** `id`, `ownerId`, `name`, `description`, `repoUrl` (外部 Git 連結), `tags`, `createdAt`, `updatedAt`
- **SkillVersion:** `id`, `skillId`, `version` (SemVer), `commitHash`, `readmeContent`, `securityStatus` (警告/安全)

### 身份驗證
- **提供者:** Git 平台 OAuth (通用 OIDC 或 GitHub/GitLab 提供者，透過 NextAuth.js)
- **Session:** 基於 JWT

## 3. 核心功能 (MVP)
### 3.1 Web UI (優先開發)
- **Landing Page:** 儀表板視圖，顯示「精選」或「最新」技能（初期使用模擬資料）。
- **技能瀏覽 (Skill Browsing):**
    - 列表視圖，具備排序功能（最新、最熱門）。
    - 依類別/標籤篩選。
    - 卡片式佈局 (High Density)。
- **技能詳情頁 (Skill Detail Page):**
    - 渲染來自外部 Git Repo 的 `README.md` / `SKILL.md`。
    - 顯示元數據（作者、版本、Repo 連結）。
- **註冊流程 (Registration Flow):**
    - 輸入「Git Repository URL」和「Tag/Version」的表單。
    - 系統抓取 Repo 中的 `metadata.json` 和 `SKILL.md` 來填充資料庫。

### 3.2 API (REST)
- `GET /api/skills`: 搜尋並列出技能。
- `GET /api/skills/:id`: 取得詳情。
- `POST /api/skills`: 註冊新技能（需驗證）。
- `PUT /api/skills/:id`: 更新版本（需驗證，僅限擁有者）。

## 4. 安全與驗證
- **輸入驗證:** 所有 API 路由使用 Zod schemas。
- **Git Repo 驗證:** 確認提供的 URL 可存取並包含所需檔案 (`SKILL.md`)。
- **秘密掃描:** (基礎) 存入資料庫前對 `SKILL.md` 內容進行正則表達式掃描。
