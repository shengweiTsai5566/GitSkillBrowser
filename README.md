![SkillBrowser Preview](index.png)

# SkillBrowser 🚀

[中文版](#中文版) | [English Version](#english-version)

---

## 中文版

**SkillBrowser** 是一個為 AI Agent 設計的技能探索與索引平台。它允許開發者透過己搭建的 Git 倉庫自動索引 Agent 技能，並提供介面供使用者搜尋、瀏覽與下載。

### ✨ 核心特色
- **Git 自動索引**：直接從 Gitea/GitHub 倉庫抓取 `SKILL.md` 或 `SKILL.ZH.md` 並自動生成文檔。
- **標準模板下載**：提供符合規範的 Skill 初始模板（包含標準目錄結構與雙語文件），降低開發門檻。
- **雙語支援**：全站支援中英文切換，預設優先顯示中文內容。
- **下載次數統計**：即時統計技能下載量，幫助社群識別熱門與高品質工具。
- **安全性掃描**：內建自動化掃描，防止敏感資訊（如 API 金鑰）洩漏在公開文檔中。
- **Neobrutalism 設計**：採用現代、強烈且具視覺衝擊力的設計風格（粗邊框、強影陰）。
- **二層加密安全**：除了系統級加密，還支援選用「個人金鑰」進行二次加密，保護您的 Git Token。

### 🛠️ 技術棧
- **全端框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **程式語言**: TypeScript
- **資料庫 ORM**: [Prisma](https://www.prisma.io/)
- **資料庫實體**: PostgreSQL
- **樣式設計**: Tailwind CSS + shadcn/ui
- **測試工具**: Vitest (單元測試), Playwright (E2E 測試)
### 🌐 Git 平台相容性 (Git Platform Compatibility)
本專案的設計高度相容於 **Gitea** 與 **GitHub**。以下是相關技術說明：

*   **為什麼能同時支援？** 由於 Gitea API 遵循 GitHub API 標準，因此本專案的 Token 驗證與資料抓取機制在兩個平台上是通用的。
*   **如何切換到 GitHub？** 僅需修改 `.env` 環境變數中的 `INTERNAL_GIT_URL`，將其改為 `https://api.github.com` 即可。
*   **自動索引機制 (Topics)**：為了精準篩選，系統會自動抓取您名下且在 Git 平台上標記有 **`skill`** 主題 (Topic) 的儲存庫，而不是盲目抓取所有專案。
*   **版本更新判斷**：系統統一使用 Git 的 `pushed_at` 欄位進行判斷，確保只有在真正的程式碼推送時才會觸發「更新」提示。

### 📦 環境架設與安裝

#### 1. 複製專案
```bash
git clone <your-repo-url>
cd SkillBrowser
```

#### 2. 安裝依賴
```bash
npm install
```

#### 3. 環境變數設定
複製 `.env.example` 並更名為 `.env`，並填入必要資訊（如 `DATABASE_URL` 與 `INTERNAL_GIT_URL`）。

#### 4. 啟動資料庫 (使用 Podman/Docker)
建議使用 Podman 建立開發資料庫環境：
```bash
podman run --name postgres-skill \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=skillbrowser \
  -p 5433:5432 -d postgres
```

**🔑 資料庫登入資訊：**
- **使用者名稱**: `postgres`
- **密碼**: `password`
- **資料庫名稱**: `skillbrowser`
- **存取埠號**: `5433`

**🔗 連線字串參考：**
- **Prisma (.env)**: `postgresql://postgres:password@localhost:5433/skillbrowser?schema=public`
- **JDBC (DBeaver)**: `jdbc:postgresql://localhost:5433/skillbrowser`

#### 5. 初始化與啟動
```bash
npx prisma migrate dev  # 初始化資料庫結構
npm run dev             # 啟動開發伺服器 (http://localhost:3000)
```

---

### 🧪 測試說明
- **單元測試**: `npm run test:unit` - 驗證認證邏輯、資料庫操作與加解密函式。
- **端對端測試**: `npm run test:e2e` - 模擬真實使用者從登錄到註冊、瀏覽、下載的完整流程。

---

### 📖 使用指南

#### A. 首次登錄與安全
1. **認證模式**: 選擇 **Internal Git** 模式。
2. **獲取 Token**: 前往您的 Git 伺服器 (Gitea) -> 設定 -> 應用程式 -> 產生令牌。
3. **二層保險金鑰**: 您可以輸入自訂的 **Personal Encryption Key**。系統**不會儲存**此金鑰，僅用於加密您的 Token 存入資料庫，確保極高安全性。

#### B. 註冊與同步技能
1. 前往 **Register Skill**。
2. **下載開發模板**：點擊右上角的 **"Download Template"**，獲取包含標準五大目錄結構 (`references`, `resources`, `examples`, `scripts`, `assets`) 與雙語文件樣板的 ZIP 包。
3. **發布技能**：在您的 Git 倉庫中上傳符合上述結構的內容，並確保倉庫帶有 `skill` 主題 (Topic)。
4. **同步索引**：在頁面列表中點擊 **"Sync This Repo"** 或 **"Resync"** 完成註冊。

---

## English Version

**SkillBrowser** is a discovery and indexing platform designed for AI Agent skills. It enables developers to automatically index agent capabilities via Git repositories and provides a bold interface for users to search, browse, and download skills.

### ✨ Key Features
- **Git Auto-Indexing**: Directly fetch and index `SKILL.md` or `SKILL.ZH.md` from Gitea/GitHub repositories.
- **Standard Template Download**: Provides a compliant Skill starter kit (including standard directory structure and bilingual templates) to simplify development.
- **Bilingual Support**: Full-site support for Chinese (ZH) and English (EN), defaulting to ZH.
- **Download Tracking**: Real-time download metrics to help the community identify popular and high-quality tools.
- **Security Scanning**: Automated detection of potential secrets (e.g., API Keys) in the documentation.
- **Neobrutalism Design**: Modern, bold visual style featuring thick borders and strong shadows.
- **Two-Layer Encryption**: Supports an optional "Personal Encryption Key" for secondary protection of your Git Tokens.

### 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest (Unit), Playwright (E2E)

### 🌐 Git Platform Compatibility
This project is designed to be highly compatible with both **Gitea** and **GitHub**. Here are the technical details:

*   **Why Dual Support?** Since the Gitea API follows the GitHub API standard, the Token-based authentication and data-fetching mechanisms are universal across both platforms.
*   **How to Switch to GitHub?** Simply modify the `INTERNAL_GIT_URL` in your `.env` file and set it to `https://api.github.com`.
*   **Auto-Indexing via Topics**: To ensure precise filtering, the system automatically fetches repositories under your account that are tagged with the **`skill`** topic, rather than indexing every project.
*   **Update Detection**: The platform uses the `pushed_at` field to accurately detect real code updates, ignoring metadata changes like description or star updates.

### 📦 Setup & Installation

#### 1. Clone Project
```bash
git clone <your-repo-url>
cd SkillBrowser
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in necessary information (e.g., `DATABASE_URL`, `INTERNAL_GIT_URL`).

#### 4. Start Database (via Podman/Docker)
It is recommended to use Podman to set up the development database:
```bash
podman run --name postgres-skill \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=skillbrowser \
  -p 5433:5432 -d postgres
```

**🔑 Database Credentials:**
- **User**: `postgres`
- **Password**: `password`
- **Database Name**: `skillbrowser`
- **Port**: `5433`

**🔗 Connection Strings:**
- **Prisma (.env)**: `postgresql://postgres:password@localhost:5433/skillbrowser?schema=public`
- **JDBC (DBeaver)**: `jdbc:postgresql://localhost:5433/skillbrowser`

#### 5. Initialization
```bash
npx prisma migrate dev  # Initialize database schema
npm run dev             # Start dev server (http://localhost:3000)
```

---

### 🧪 Testing
- **Unit Tests**: `npm run test:unit` - Verifies auth logic, DB operations, and encryption functions.
- **E2E Tests**: `npm run test:e2e` - Simulates the full user flow from login to registration, browsing, and downloading.

---

### 📖 User Guide

#### A. First-Time Login & Security
1. **Auth Mode**: Select **Internal Git** mode.
2. **Get Token**: Go to your Git server (Gitea) -> Settings -> Applications -> Generate Token.
3. **Personal Key**: You can enter a **Personal Encryption Key**. The system **does not store** this key; it is only used to encrypt your Token for the database.

#### B. Registering & Syncing Skills
1. Go to **Register Skill**.
2. Select your repository and click **"Sync This Repo"** or **"Resync"**.
3. The system fetches `SKILL.zh.md` (preferred) or `SKILL.md` for display and tracks download metrics.

---

## 🤝 Contribution
Contributions and bug reports are welcome! As my first open-source project, I appreciate all your support.

## 📄 License
[MIT License](LICENSE)
