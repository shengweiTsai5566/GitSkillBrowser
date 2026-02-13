# ✅ Skill Browser CLI (sk) 驗收計畫

本文件定義了 CLI 工具的發布前驗收標準，包含自動化測試與人工操作驗證。

## 1. 自動化驗證 (Automated Verification)

**目標**：確保核心邏輯 (Scanner) 無誤。

### 執行步驟：
1. 開啟終端機，進入 `cli` 目錄。
2. 執行測試指令：
   ```bash
   npm test
   ```
### 預期結果：
- [ ] 所有測試案例 (Tests) 顯示為 **PASS**。
- [ ] 包含 VSCode, Antigravity, CrewAI 的偵測案例。

---

## 2. 人工驗證 (Manual Verification)

**目標**：確保 CLI 在真實環境中能與 Gitea 互動並正確安裝檔案。

### 準備工作：
- 確保已執行 `npm run build` 和 `npm link`。
- 準備一個測試用的 Gitea Token。

### 案例 A: 登入 (Login)
1. 執行 `sk login`。
2. 輸入 Email 與 Gitea URL (預設值)。
3. 輸入 Token。
4. **預期**：顯示 "Verified! Logged in as [User]" 並提示儲存成功。

### 案例 B: 搜尋 (Search)
1. 執行 `sk search` (列出所有)。
2. 執行 `sk search pdf` (關鍵字搜尋)。
3. **預期**：顯示表格化的技能清單，包含名稱、描述與作者。

### 案例 C: 智慧安裝 (Smart Install)
1. **情境 1：VSCode 環境**
   - 建立一個空資料夾 `test-vscode`，裡面建立 `.vscode` 資料夾。
   - 在該目錄下執行 `sk install [skill-name]` (例如 `pdf-parser`)。
   - **預期**：CLI 詢問 "Detected VSCode / Copilot. Install to .vscode/skills?"。
   - **預期**：確認後，技能被解壓縮至 `.vscode/skills/[skill-name]`。

2. **情境 2：Antigravity 環境**
   - 建立一個空資料夾 `test-anti`，裡面建立 `.antigravity` 資料夾。
   - 在該目錄下執行 `sk install [skill-name]`。
   - **預期**：CLI 詢問 "Detected Antigravity. Install to .agent/skills?"。

3. **情境 3：手動選擇**
   - 在空資料夾執行 `sk install [skill-name]`。
   - **預期**：CLI 顯示選單，讓使用者選擇目標工具 (Cursor, CrewAI, etc.) 或自訂路徑。

---

## 3. 解除安裝與清理
測試完成後，若要移除 CLI：
```bash
npm unlink -g @skill-browser/cli
```
