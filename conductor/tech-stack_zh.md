# 技術堆疊：內部 Agent 技能市集

## 1. 核心框架
*   **全端框架：** [Next.js](https://nextjs.org/) (React)
    *   *理由：* 為 UI 和 API Routes 提供無縫的開發者體驗，支援伺服器端渲染 (SSR) 和靜態生成。
*   **語言：** TypeScript
    *   *理由：* 確保全端型別安全，提高可維護性並減少執行時錯誤。

## 2. 後端與數據
*   **資料庫：** PostgreSQL
    *   *理由：* 強大的關聯式數據存儲，用於技能元數據（支援雙語說明）、用戶關係以及使用指標（下載次數）。
*   **ORM：** Prisma
    *   *理由：* 與 Next.js 和 PostgreSQL 完美整合的現代、類型安全 ORM。
*   **存儲層：** Git 整合
    *   *理由：* 上傳的技能直接在 Git 儲存庫中進行存儲和版本控制，提供內建的歷史記錄和開發者友好的存取方式。自動索引雙語文檔（SKILL.md / SKILL.zh.md）。

## 3. 前端與樣式
*   **CSS 框架：** Tailwind CSS
    *   *理由：* 用於快速、響應式且高度可自訂 UI 開發的 Utility-first CSS。
*   **UI 元件：** shadcn/ui
    *   *理由：* 基於 Radix UI 和 Tailwind CSS 構建的開源、無障礙且可自訂的元件庫。(完全免費/MIT)

## 4. 基礎設施與 DevOps
*   **開發環境：** Podman
    *   *理由：* 用於在本地容器化資料庫和其他服務，確保環境一致性。
*   **身份驗證：** Git 平台 OAuth (例如：內部 GitLab/GitHub)
    *   *理由：* 利用現有的企業 Git 身份進行 SSO，並促進經授權的 Git 儲存操作。

## 5. 安全與驗證
*   **Schema 驗證：** Zod
    *   *理由：* 用於 API 請求和上傳的 `metadata.json` 檔案的執行時驗證。
*   **秘密掃描：** 整合 gitleaks 或在上傳過程中使用自訂正則表達式掃描。
