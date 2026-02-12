---
marp: true
theme: gaia
class: lead
backgroundColor: #fff
paginate: true
header: 'Innolux Skill Browser Project Report'
footer: '2026/02/11 | AI Center Team'
style: |
  section { font-family: 'Microsoft JhengHei', sans-serif; padding: 2.0rem 2.5rem; }
  h1 { color: #000; }
  h2 { color: #333; }
  img { box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; max-width: 100%; }
  /* Ensure long headings/lines wrap instead of overflowing */
  h1, h2, h3, p, li { word-break: break-word; overflow-wrap: break-word; }

  /* Constrain Marp background images so text has space */
  section[data-background-image] {
    background-size: 40% !important;
    background-position: right center !important;
    background-repeat: no-repeat !important;
    padding-right: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* default: bg on right -> content on left */
  }

  /* When an author intentionally places bg on the left */
  section[data-background-image].bg-left,
  section[data-background-image][data-background-position="left"] {
    background-position: left center !important;
    padding-left: 3.5rem;
    padding-right: 1rem;
    justify-content: flex-end; /* bg on left -> content on right */
  }

  /* Limit content width and enforce left-aligned, responsive typography when a background exists */
  section[data-background-image] > * {
    max-width: 50%;
    text-align: left;
    margin: 0;
  }

  /* When the background is on the left, keep the text right-aligned container */
  section[data-background-image].bg-left > * {
    text-align: left; /* keep text left-aligned inside its column for readability */
  }

  /* Reduce oversized headings on slides with background images to avoid overflow */
  section[data-background-image] h1,
  section[data-background-image] h2,
  section[data-background-image] h3 {
    font-size: clamp(1.2rem, 3.8vw, 2.2rem) !important;
    line-height: 1.05 !important;
    margin-bottom: 0.6rem !important;
  }

  /* Slightly reduce paragraph size in image slides to keep balance */
  section[data-background-image] p,
  section[data-background-image] li {
    font-size: clamp(0.9rem, 1.8vw, 1.15rem) !important;
  }
---

# Innolux Skill Browser
## 企業級 AI Agent 技能共享平台

### 連結孤島 · 賦能團隊 · 驅動創新

---

# 1. 現狀與痛點 (The Challenge)

### AI 時代的「孤島效應」

- **重複造輪子**
  各部門重複開發相似工具 (PDF Parser, SQL Gen)，資源浪費。
- **缺乏統一分發管道**
  工具散落在個人的 Git 或電腦中，難以共享。
- **版本管理混亂**
  使用者無法確認手上的工具是否為最新、最安全的版本。

---

# 2. 產品願景 (The Solution)

### 打造內部的「AI App Store」

![bg right:40%](01_landing_page.png)

**核心目標：**
1. **集中化索引**：一站式查找所有內部 Agent 技能。
2. **標準化分發**：統一的安裝與版本管理流程。
3. **可視化資產**：讓無形程式碼轉化為可見的公司資產。

---

# 3. 核心功能：直覺探索

### 像逛網拍一樣簡單

![bg left:40%](02_skill_list.png)

- **即時搜尋**：支援關鍵字與 Tag 過濾。
- **透明數據**：顯示星數、下載量，建立信任指標。
- **狀態追蹤**：自動標示 "New Update"，確保使用最新技術。

---

# 4. 核心功能：完整詳情

### 降低使用門檻

![bg right:40%](07_skill_detail_top.png)

- **雙語支援**：一鍵切換中/英文件，打破語言隔閡。
- **一鍵安裝**：提供標準化下載按鈕。
- **安全警告**：系統自動掃描潛在風險，保障企業資安。

---

# 5. 安全與權限 (Security)

### 整合既有帳號體系

![bg left:40%](05_login_filled.png)

- **Git OAuth 整合**：使用內部帳號登入，無須記憶新密碼。
- **雙重加密機制**：
  - 平台不儲存明碼 Token。
  - 強制要求使用者設定 **Personal Key** 進行解密。
  - 確保即使資料庫外洩，Git 權限依然安全。

---

# 6. 無痛上傳 (Zero-Friction)

### 自動化索引引擎

![bg right:40%](06_upload_page_with_data.png)

- **自動偵測**：
  系統自動掃描 Git 上帶有 `skill` 主題的專案。
- **版本同步**：
  以 `pushed_at` 精準判斷程式碼變更，自動提示更新。
- **無需填表**：
  開發者專注寫 Code，平台負責上架。

---

# 7. 商業價值 (Business Value)

1. **提升研發效率 (+30%)**
   減少基礎工具的重複開發時間，直接引用現成模組。
2. **知識資產化**
   將散落的程式碼轉化為可累積、可管理的數位資產。
3. **降低 AI 門檻**
   讓業務單位也能透過組合現有技能，快速搭建 AI 應用。

---

# 8. 未來展望 (Roadmap)

- **CLI 客戶端工具 (`sb install`)**
  支援自動化腳本與 CI/CD 整合。
- **社群評價機制**
  引入評分與評論系統，建立優質技能篩選機制。
- **主動推播通知**
  當關注的技能有重大更新或安全修補時，主動通知使用者。

---

<!-- _class: lead -->

# Thank You

### 讓 AI 的力量在組織內倍增

**Innolux Skill Browser Team**

