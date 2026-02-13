# 🏗️ Skill Browser 系統架構深度解析 (System Architecture Deep Dive)

本文檔旨在提供 Skill Browser 系統的完整技術架構視圖，適用於資深工程師、架構師或維護者。內容涵蓋設計決策、數據流、安全性與擴展性規劃。

## 1. 系統概觀 (System Overview)

Skill Browser 是一個基於 **Next.js (App Router)** 的全端應用程式，旨在解決企業內部 AI Agent 技能的分發與索引問題。系統設計遵循 **「去中心化開發，中心化索引」** 的原則。

### 1.1 技術堆疊 (Tech Stack)
*   **Runtime**: Node.js (LTS)
*   **Framework**: Next.js 14 (App Router, React Server Components)
*   **Language**: TypeScript (Strict Mode)
*   **Database**: PostgreSQL 15+
*   **ORM**: Prisma
*   **UI/UX**: Tailwind CSS, Radix UI (shadcn/ui), Lucide Icons
*   **Testing**: Vitest (Unit), Playwright (E2E)

### 1.2 核心數據流 (Data Flow)
1.  **Indexing**: 系統定期或被動觸發 (Webhook/User Action) 掃描 Gitea API。
2.  **Filtering**: 依據 Repository Topic (`skill`) 進行篩選。
3.  **Parsing**: 抓取 `SKILL.md` / `SKILL.ZH.md` 內容與元數據。
4.  **Serving**: 透過 Server Components 直接渲染 HTML 至前端，或提供 REST API 供 CLI 工具使用。

---

## 2. 前端架構 (Frontend Architecture)

我們採用 **Hybrid Rendering** 策略，最大化效能與 SEO，同時保留必要的互動性。

### 2.1 路由與組件策略 (App Router)
*   **Server Components (預設)**：所有頁面 (`page.tsx`) 與佈局 (`layout.tsx`) 預設為 Server Component。
    *   *優勢*：直接存取 DB，減少 Client Bundle Size，零 Waterfall 請求。
    *   *職責*：數據獲取 (Fetching)、權限檢查 (Auth)、初始 HTML 渲染。
*   **Client Components (`use client`)**：僅在需要互動的葉節點使用。
    *   *職責*：表單輸入 (`UploadPage`)、即時篩選 (`SkillFilter`)、Toast 通知。

### 2.2 狀態管理 (State Management)
由於大部分數據由 Server Component 處理，我們大幅減少了對 Redux/Zustand 等全域狀態庫的需求。
*   **URL as State**: 搜尋、分頁參數直接反映在 URL Query Params，實現可分享與書籤化。
*   **Context API**: 僅用於全域設定，如：
    *   `LanguageProvider`: 處理 i18n 語系切換 (LocalStorage + Context)。
    *   `SessionProvider`: 處理 NextAuth 登入狀態。

---

## 3. 後端與數據層 (Backend & Data Layer)

### 3.1 API 設計
位於 `src/app/api`，遵循 RESTful 風格。
*   **Route Handlers**: 使用 Next.js 的 `GET`, `POST` 等標準 Web API Response。
*   **Edge Edge Compatibility**: 目前部署於 Node.js 環境，但代碼結構預留了邊緣運算 (Edge Runtime) 的相容性（移除 Node.js 特定 API）。

### 3.2 資料庫模型 (Prisma Schema)
核心模型設計如下 (`prisma/schema.prisma`)：

*   **`User`**: 
    *   儲存基本資料與 **加密後的 Git Token**。
    *   `gitToken`: String (Encrypted)
*   **`Skill`**:
    *   核心實體，包含名稱、描述、Repo URL、統計數據 (`downloadCount`)。
    *   關聯：`User` (Owner) -> 1:N -> `Skill`。
*   **`SkillVersion`**:
    *   實現版本控制與回溯。
    *   紀錄 `commitHash`、`readmeContent` (快照)。
    *   每次同步 (Sync) 時，若檢測到新 Commit，則建立新 Version。

### 3.3 Git 整合服務 (Multi-Provider Support)
本系統實作了智慧型 Git Adapter (`src/lib/git-client.ts`)，具備以下特性：
*   **自動偵測 (Auto-Discovery)**：依據 `.env` 中的 `INTERNAL_GIT_URL` 自動判斷 Provider 類型（Gitea 或 GitHub）。
*   **API 歸一化**：統一處理 Gitea 的 `/api/v1` 與 GitHub 的 REST API 差異（如搜尋路徑、Archive 下載格式）。
*   **Raw Content 抓取**：針對不同平台採用最佳抓取策略（GitHub 採用 `Accept: application/vnd.github.v3.raw` 標頭以節省 Base64 解碼開銷）。

### 3.4 標籤驅動搜尋系統 (Tag-based Discovery)
為了提供比單純關鍵字更強大的搜尋體驗，我們實作了標籤管理系統：
*   **多源標籤合併**：註冊時會將 `SKILL.md` 解析出的標籤與用戶手動輸入的標籤進行聯集去重。
*   **高效聚合查詢**：透過 PostgreSQL 的 `unnest` 與 `count` 進行 API 端數據聚合 (`GET /api/tags`)，動態生成標籤雲。
*   **OR 邏輯篩選**：搜尋引擎支援多選標籤過濾，底層使用 Prisma 的 `hasSome` 運算子實作。

---

## 4. 安全架構 (Security Architecture)

這是本系統最關鍵的設計，針對「代管 Token」的風險進行防護。

### 4.1 雙層加密機制 (Two-Layer Encryption)
為了防止資料庫洩漏導致全公司 Git 權限外洩，我們實作了應用層加密 (`src/lib/encryption.ts`)。

1.  **第一層 (System Key)**: 使用 `.env` 中的 `ENCRYPTION_KEY` 進行 AES-256-GCM 加密。
2.  **第二層 (Personal Key)**: (選用) 用戶可設定「個人金鑰」。
    *   Token 在加密前，會先與個人金鑰進行 Salt/Hash 運算。
    *   **關鍵設計**：個人金鑰 **絕對不存入資料庫**。僅存在於用戶當下的 Session (JWT) 中。
    *   *結果*：即使駭客拿到整個 DB 和 `.env`，若無用戶的個人金鑰，依然無法解密 Git Token。

### 4.2 認證流程 (NextAuth.js)
*   **Provider**: 自定義 `CredentialsProvider`。
*   **Strategy**: JWT (Stateless)。
*   **流程**：
    1. 前端傳送 Email + Token (+ Personal Key)。
    2. 後端使用 Token 嘗試呼叫 Gitea `/user` API。
    3. 若成功 (200 OK)，視為認證通過。
    4. 將 Token 加密後存入/更新 DB。
    5. 核發 JWT，內含部分使用者資訊與 Personal Key (若有)。

---

## 5. 擴展性與維護 (Scalability & Maintenance)

### 5.1 容器化 (Containerization)
*   支援 Docker/Podman。
*   **Multi-stage Build**: 使用 Next.js 的 `output: 'standalone'` 模式，大幅縮減 Image 體積（< 100MB）。

### 5.2 效能優化
*   **靜態生成 (SSG)**: 對於不常變動的頁面 (如 `GuidePage`)。
*   **增量靜態再生 (ISR)**: 計畫用於 Skill Detail 頁面，設定 `revalidate: 60`，兼顧效能與即時性。
*   **Image Optimization**: 使用 `next/image` 自動處理圖片壓縮與格式轉換 (WebP)。

### 5.3 監控與日誌
*   目前使用標準 `console.log` / `console.error`。
*   建議在生產環境接入 **Sentry** 或 **OpenTelemetry** 以追蹤 API 錯誤與前端異常。

---

## 總結
Skill Browser 的架構核心在於 **「平衡」**：
*   在 **Next.js 全端能力** 與 **清晰的架構分層** 之間取得平衡。
*   在 **極致的使用者體驗 (自動索引)** 與 **嚴格的資安要求 (雙層加密)** 之間取得平衡。

維護者應謹記：**任何對 `src/lib/auth.ts` 或 `encryption.ts` 的修改，都必須經過嚴格的 Code Review 與測試。**
