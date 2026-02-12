# 🎨 Module 1: 現代前端工程 - React 與 Next.js

歡迎來到前端世界！這裡我們學習如何用程式碼「畫」出使用者介面。

## 1. React 的核心：元件 (Component)

想像你在玩樂高。你不會一次就做出一個城堡，你會先做出「城牆」、「塔樓」、「大門」，然後再把它們組起來。

在 React 裡，這些零件就叫做 **Component (元件)**。

### 程式碼長什麼樣子？
一個 Component 其實就是一個 **JavaScript 函式 (Function)**，但它回傳的是 **HTML** (長得像 HTML 的 JSX)。

```tsx
// 這是一個「按鈕」元件
function MyButton() {
  return <button className="bg-blue-500 text-white p-2">點我！</button>;
}

// 這是一個「首頁」元件，它使用了按鈕元件
export default function HomePage() {
  return (
    <div>
      <h1>歡迎光臨</h1>
      <MyButton />  {/* <-- 像積木一樣放進來，想放幾個就放幾個 */}
      <MyButton />
    </div>
  );
}
```

### 為什麼要這樣做？
*   **重複利用 (Reusability)**：寫一次按鈕，全站都可以用。
*   **好維護 (Maintainability)**：如果要改按鈕顏色，只要去改 `MyButton` 一個地方，全站一萬個按鈕都會一起變！

---

## 2. Next.js 的魔法：檔案即路由 (File-system Routing)

在以前，寫網站要設定一堆「網址對應規則」。但在 Next.js (App Router) 裡，**資料夾結構就是網址**。

### 規則很簡單：
只要在 `src/app` 下面建立資料夾，裡面放一個 `page.tsx`，它就會變成網頁。

| 檔案路徑 | 對應網址 | 用途 |
| :--- | :--- | :--- |
| `src/app/page.tsx` | `https://site.com/` | 首頁 |
| `src/app/skills/page.tsx` | `https://site.com/skills` | 技能列表頁 |
| `src/app/about/page.tsx` | `https://site.com/about` | 關於我們 |

### 動態路由 (Dynamic Routes)
那如果是「技能詳情頁」，每個技能 ID 都不一樣怎麼辦？
我們用 `[方括號]` 來表示變數。

*   `src/app/skills/[id]/page.tsx` -> 可以對應 `skills/1`、`skills/abc`、`skills/pdf-parser`。
*   在程式碼裡，你可以拿到這個 `id` 是什麼，然後去資料庫撈資料。

---

## 3. Server Component vs Client Component

這是 Next.js 最強大也最容易搞混的地方。請務必搞懂！

### 伺服器元件 (Server Component) - 預設 🏢
*   **在哪裡執行？** 在伺服器上。
*   **能做什麼？** 直接讀資料庫、讀檔案、讀 API 金鑰 (因為在伺服器跑，金鑰不會外洩)。
*   **不能做什麼？** 不能用滑鼠點擊事件 (`onClick`)、不能用狀態 (`useState`)。
*   **比喻**：**外帶便當**。廚師 (伺服器) 煮好包起來給你，你拿到就能吃，但你不能要求廚師現在幫你加鹽，因為便當已經包好了。

### 客戶端元件 (Client Component) 💻
*   **怎麼標記？** 在檔案最上面加一行 `"use client";`。
*   **在哪裡執行？** 在使用者的瀏覽器上 (部分在伺服器預渲染)。
*   **能做什麼？** 互動！按鈕點擊、表單輸入、跳出視窗。
*   **比喻**：**自助火鍋**。材料給你，你要自己煮，可以自己調醬料，隨時可以加料。

### 何時用哪個？
*   **讀資料、顯示文章** -> 用 **Server Component** (速度快、SEO 好)。
*   **搜尋框、登入按鈕、按讚** -> 用 **Client Component**。

---

## ✅ 本章作業 (Homework)
1.  **尋寶遊戲**：找到專案中的 `src/components/ui/button.tsx`，看看一個標準的按鈕元件長什麼樣子。
2.  **動手做**：
    *   在 `src/app` 下建立一個新資料夾 `hello`。
    *   在裡面建立一個 `page.tsx`。
    *   寫一個 Function `export default function Page() { return <h1>Hello World</h1> }`。
    *   在瀏覽器打開 `http://localhost:3000/hello` 看看成果！
