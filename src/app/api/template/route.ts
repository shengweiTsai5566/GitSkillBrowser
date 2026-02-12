import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";

export async function GET(req: NextRequest) {
  try {
    const zip = new AdmZip();

    // 1. SKILL.md (English Template)
    const skillMdContent = [
      "---",
      "name: my-new-skill",
      'description: I invoke this skill when users request [specific task], facilitating [specific outcome] through standardized workflows.',
      "---",
      "",
      "# My New Skill",
      "",
      "This skill provides...",
      "",
      "## Evolution & Feedback Loop",
      "### 1. Encounter & Report",
      "- Identify new problem characteristics.",
      "- Describe the resolution method.",
      "- **Report to User**: Ask if this discovery should be codified.",
      "",
      "### 2. Solve & Extract",
      "- Identify patterns, error codes, or scripts.",
      "",
      "### 3. Knowledge Feedback",
      "- Update subdirectories (`references`, `resources`, `examples`).",
      "",
      "### 4. Bilingual Sync",
      "- Ensure both `SKILL.md` and `SKILL.ZH.md` are updated.",
    ].join("\n");

    zip.addFile("SKILL.md", Buffer.from(skillMdContent, "utf-8"));

    // 2. SKILL.ZH.md (Chinese Template) - 注意檔名大小寫
    const skillZhMdContent = [
      "---",
      "name: my-new-skill",
      'description: 當用戶要求[特定任務]時，我會呼叫此技能來協助[特定成果]，確保流程符合標準規範。',
      "---",
      "",
      "# My New Skill (技能名稱)",
      "",
      "此技能提供...",
      "",
      "## 技能演進回饋機制 (Evolution & Feedback Loop)",
      "### 1. 遇見新問題與回報",
      "- 識別新問題的特徵。",
      "- 描述採取的解決方案。",
      "- **向用戶報告**：詢問是否應將此發現編碼進技能規格中。",
      "",
      "### 2. 解決與提取",
      "- 從成功的解決過程中識別具體的模式、錯誤代碼或腳本。",
      "",
      "### 3. 知識反饋",
      "- 更新技能的子目錄（`references`、`resources`、`examples`）。",
      "",
      "### 4. 雙語同步",
      "- 確保 `SKILL.md` (英文) 與 `SKILL.ZH.md` (中文) 同步更新。",
    ].join("\n");

    zip.addFile("SKILL.ZH.md", Buffer.from(skillZhMdContent, "utf-8"));

    // 3. Create Standard Directories (Empty placeholders)
    // Adding a .gitkeep file to ensure directories are created when unzipped/committed
    const gitKeep = Buffer.from("", "utf-8");
    zip.addFile("references/.gitkeep", gitKeep);
    zip.addFile("resources/.gitkeep", gitKeep);
    zip.addFile("examples/.gitkeep", gitKeep);
    zip.addFile("scripts/.gitkeep", gitKeep);
    zip.addFile("assets/.gitkeep", gitKeep);

    // 4. .gitignore
    const gitignoreContent = [
      "__pycache__/",
      "*.py[cod]",
      ".env",
      ".venv",
      "node_modules/",
      ".DS_Store",
      ".gitkeep"
    ].join("\n");
    zip.addFile(".gitignore", Buffer.from(gitignoreContent, "utf-8"));

    // 5. Generate ZIP
    const buffer = zip.toBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="skill-template.zip"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
