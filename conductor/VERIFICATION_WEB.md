# ✅ Web 平台雙模式驗收計畫 (Manual Verification Plan)

本文件引導您驗證 Skill Browser Web 平台是否能正確支援公司內部 Gitea 與公開 GitHub。

## 1. 環境準備

請確保您擁有以下憑證：
1.  **Gitea**: 內部 IP (預設)、您的帳號 Email、Gitea Token。
2.  **GitHub**: 公開 GitHub 帳號 Email、GitHub Personal Access Token (scope: `repo` 或 `public_repo`)。

---

## 2. 案例 A：驗證 Gitea 模式 (Internal)

這是預設模式，模擬公司內部使用場景。

### 步驟 1：設定環境
檢查 `.env` 檔案，確保 `INTERNAL_GIT_URL` 指向公司 Gitea：
```env
INTERNAL_GIT_URL="http://tnvcimweb1.cminl.oa/git-server"
```
*修改後請重啟伺服器 (`npm run dev`)。*

### 步驟 2：執行登入
1.  前往 `http://localhost:3000/auth/signin`。
2.  輸入您的 **公司 Email**。
3.  輸入您的 **Gitea Token**。
4.  **預期**：成功登入，導向首頁，右上角顯示您的頭像。

### 步驟 3：註冊技能
1.  點擊 **Register Skill**。
2.  點擊 **Refresh List** (重新整理列表)。
3.  **預期**：看到您 Gitea 帳號下帶有 `skill` 主題的專案列表。
4.  選擇一個專案點擊 **Sync This Repo**。
5.  **預期**：成功跳轉至技能詳情頁，Markdown 內容正確顯示。

### 步驟 4：下載技能
1.  在技能詳情頁點擊 **Install (ZIP)**。
2.  **預期**：瀏覽器下載 `.zip` 檔案，解壓縮後內容無誤。

---

## 3. 案例 B：驗證 GitHub 模式 (Public)

這是擴充模式，模擬連接到開源社群。

### 步驟 1：設定環境
修改 `.env` 檔案，將 `INTERNAL_GIT_URL` 改為 GitHub：
```env
INTERNAL_GIT_URL="https://api.github.com"
```
*修改後務必重啟伺服器 (`npm run dev`)。*

### 步驟 2：執行登入
1.  前往 `http://localhost:3000/auth/signin`。
2.  輸入您的 **GitHub Email** (注意：必須是 GitHub 帳號的主 Email)。
3.  輸入您的 **GitHub Token**。
4.  **預期**：成功登入，顯示您在 GitHub 的頭像與名稱。

### 步驟 3：註冊技能 (尋找開源技能)
1.  點擊 **Register Skill**。
2.  點擊 **Refresh List**。
3.  **預期**：系統列出您 GitHub 帳號下帶有 `skill` 主題的 Repo (如果您沒有，可以先去 GitHub 隨便找個 Repo 加上 `skill` topic)。
4.  點擊 **Sync This Repo**。
5.  **預期**：成功抓取 GitHub 上的 README 並顯示。

### 步驟 4：下載技能
1.  點擊 **Install (ZIP)**。
2.  **預期**：成功下載 GitHub 提供的 Source Code Zipball。

---

## 4. 故障排除

*   **登入失敗 (Invalid Token)**：
    *   檢查 Token 權限。GitHub Token 必須勾選 `repo` (私有) 或 `public_repo` (公開)。
    *   Gitea Token 必須是 Personal Access Token。
*   **找不到技能 (No Repos)**：
    *   確認該 Repo 是否真的加上了 `skill` 這個 Topic (主題)。
    *   確認該 Repo 是否為您本人擁有 (Owner) 或您有權限存取。
