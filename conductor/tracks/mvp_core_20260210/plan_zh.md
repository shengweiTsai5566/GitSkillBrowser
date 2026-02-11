# 實施計畫 - MVP 核心基礎設施 (mvp_core_20260210)

本計畫概述了建立 Agent 技能市集核心基礎設施的步驟，優先考量前端 UI「外殼」的建置，並整合 Playwright 進行 E2E 測試。

## Phase 1: 前端外殼與 UI 模擬 (結合 Playwright 測試)
- [x] Task: 初始化 Next.js 專案 (TypeScript, Tailwind CSS, shadcn/ui) 0edef72
- [x] Task: 安裝與設定 Playwright 進行 E2E 測試 0edef72
- [x] Task: 建立核心版面配置元件 (導航列, 頁尾, App 外殼) 0edef72
- [x] Task: 實作 Landing Page 與模擬精選技能 0edef72
- [x] Task: 編寫 Playwright E2E 測試: 驗證 Landing Page 正確渲染 0edef72
- [x] Task: 實作技能瀏覽列表與模擬資料篩選 UI 0edef72
- [x] Task: 編寫 Playwright E2E 測試: 驗證技能瀏覽與篩選互動 0edef72
- [x] Task: 實作技能詳情頁與模擬 Markdown 內容渲染 0edef72
- [x] Task: 編寫 Playwright E2E 測試: 驗證技能詳情頁內容渲染 0edef72
- [x] Task: 建立「註冊技能」靜態表單 (僅 UI，無 API 綁定) 0edef72
- [x] Task: 編寫 Playwright E2E 測試: 驗證註冊頁面表單元素 0edef72
- [x] Task: Conductor - 使用者手動驗證 'Phase 1: 前端外殼與 UI 模擬' (協議詳見 workflow.md) 0edef72 [checkpoint: 0edef72]

## Phase 2: 資料庫與認證基礎設施 [checkpoint: 825dfd9]
- [x] Task: 設定 Podman 以運行本地 PostgreSQL 資料庫 d60da93
- [x] Task: 設定 Prisma 與 PostgreSQL 連線 14f3173
- [x] Task: 定義 Prisma schema (User, Skill, SkillVersion) 14f3173
- [x] Task: 實作 User 與 Skill 模型遷移 (Migrations) de99c31
- [x] Task: 設定 NextAuth.js 與 Git OAuth 提供者 (基礎設定 + 多模式支援: Public/Internal/Dev/Token/Gitea) 5d16516
- [x] Task: Conductor - 使用者手動驗證 'Phase 2: 資料庫與認證基礎設施' (已成功驗證 Gitea Token 登入與 DB 同步) 5d16516 [checkpoint: 5d16516]

## Phase 3: API 實作與真實整合

- [x] Task: 實作 GET /api/skills (搜尋與列表) 連結至 DB cfadc45

- [x] Task: 實作 GET /api/skills/:id (技能詳情) 連結至 DB 80e6f57
- [x] Task: 實作 POST /api/skills (註冊) 包含 Git 抓取邏輯 29c0cc9
- [x] Task: 重構前端以使用真實 API 呼叫取代模擬資料 8d2e91a
- [x] Task: 編寫 Playwright E2E 測試: 完整整合測試 (註冊 -> 列表 -> 檢視詳情) b59abde
- [x] Conductor - 使用者手動驗證 'Phase 3: API 實作與真實整合' (已驗證 UI 整合與 API 串接) b59abde [checkpoint: b59abde]

## Phase 4: 最終 MVP 整合與潤飾
- [x] Task: 實作基礎安全性/秘密掃描正則表達式 b59abde
- [x] Task: 最終全專案 Linting 與型別檢查 b59abde
- [x] Conductor - 使用者手動驗證 'Phase 4: 最終 MVP 整合與潤飾' (已通過最終建置與安全性檢查) b59abde [checkpoint: b59abde]