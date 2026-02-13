# Specification - Skill Browser CLI Client (sk)

## 1. Overview
Develop a CLI tool named `sk` to act as the terminal client for Skill Browser. It enables developers to search, authenticate, and install Agent Skills directly into their project environments (Antigravity, VSCode, CrewAI, Gemini, etc.).

## 2. Core Features

### 2.1 Authentication (`sk login`)
- **Input**: Email, Gitea URL, Personal Access Token.
- **Storage**: Securely store credentials locally using `conf`.
- **Validation**: Verify token validity against Gitea API `/user` endpoint.

### 2.2 Search & Discovery (`sk search <keyword>`)
- **API**: Directly query Gitea `/repos/search` with `topic=skill`.
- **Display**: Render results in a terminal-friendly table (ID, Description, Author, Updated).

### 2.3 Smart Installation (`sk install <skill-id>`)
- **Intelligent Detection**: Automatically scan the current directory for tool signatures:
    - `.gemini/` -> `~/.gemini/.agent/skills` (Global) or `./.agent/skills` (Local)
    - `.antigravity/` -> `./.agent/skills`
    - `.cursor/` -> `./.cursor/rules`
    - `.vscode/` -> `./.vscode/skills`
    - `config/agents.yaml` (CrewAI) -> `./tools`
    - `claude_desktop_config.json` -> `./.claude/skills`
- **Interactive Flow**:
    - If one match: Prompt to confirm default path.
    - If multiple matches: Prompt to select target.
    - If no match: Prompt to select generic tool or enter custom path.
- **Execution**:
    - Resolve repository `full_name` via search API.
    - Download `archive/master.zip` from Gitea.
    - Extract contents to the selected target directory.

## 3. Technical Architecture
- **Language**: TypeScript (Node.js)
- **Framework**: Commander.js
- **UI**: Inquirer.js (Prompts), Chalk (Colors), Ora (Spinners), CLI-Table3
- **Deployment**: NPM Package (scoped `@skill-browser/cli`)

## 4. Distribution Strategy (Phase 4)
- Publish to internal NPM registry.
- Users install via `npm install -g @skill-browser/cli`.
