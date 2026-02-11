# Product Definition: Internal Agent Skills Marketplace

## 1. Vision
To build a centralized "Skill Marketplace" for the company (modeled after [SkillsMP](https://skillsmp.com/)), enabling employees to easily discover, share, and manage AI Agent Skills. This platform will serve as the hub for internal AI capability sharing, standardizing how Agent tools are distributed and utilized across teams.

## 2. Target Audience
*   **Employees (Developers/Users):** Searching for specific Agent capabilities to enhance their workflow or sharing their own created tools.
*   **Managers:** Looking to equip their teams with standardized, efficient AI tools.

## 3. Core Features
*   **Skill Discovery:** A web-based repository to browse, search, and filter Agent Skills (with `SKILL.md` support).
    *   **Bilingual Support:** Defaulting to Chinese (ZH) display with easy toggle to English (EN).
    *   **Engagement Tracking:** Real-time download count tracking for each skill.
*   **Dual Interface:**
    *   **Web UI:** For browsing, documentation reading, manual upload/download.
    *   **REST API:** For automated uploading, updating, and downloading of skills (CI/CD integration).
*   **Skill Management:**
    *   **Ownership Control:** Users can only modify or update skills they have uploaded.
    *   **Versioning:** Support for updating existing skills via API/Web.
*   **Quality & Safety:**
    *   **Schema Validation:** Automated check for `SKILL.md` and metadata structure compliance upon upload.
    *   **Security Scanning:** Automated pre-scan for secrets (API keys) and basic security risks.

## 4. Execution Model
*   **Local Installation:** The platform acts as a distribution center. Users download the skill packages to their local environments (e.g., `.agent/skills` directories) for their Agents to use.