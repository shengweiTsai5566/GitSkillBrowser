# Track Specification: MVP Core Infrastructure

## 1. Overview
This track establishes the foundation of the Agent Skills Marketplace. It includes setting up the Next.js development environment, configuring the PostgreSQL database (running in Podman), implementing the core database schema with Prisma, setting up Git OAuth authentication, and building the essential "Browse" and "Register Skill" features.

## 2. Technical Requirements
### Environment
- **Runtime:** Node.js (Latest LTS)
- **Containerization:** Podman (for local PostgreSQL database)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui

### Database Schema (Prisma)
- **User:** `id`, `email`, `name`, `provider` (git), `createdAt`
- **Skill:** `id`, `ownerId`, `name`, `description`, `descriptionZH`, `downloadCount`, `repoUrl` (External Git Link), `tags`, `createdAt`, `updatedAt`
- **SkillVersion:** `id`, `skillId`, `version` (SemVer), `commitHash`, `readmeContent`, `readmeContentZH`, `securityStatus` (warn/safe)

### Authentication
- **Provider:** Git Platform OAuth (Generic OIDC or GitHub/GitLab provider via NextAuth.js)
- **Session:** JWT based

## 3. Core Features (MVP)
### 3.1 Web UI
- **Landing Page:** Dashboard view with "featured" or "recent" skills.
- **Skill Browsing:**
    - List view with sorting (Newest, Most Downloaded).
    - Bilingual toggle (ZH/EN) for card descriptions.
    - Search by name, description, or tags.
    - Card layout (High Density) with download counter.
- **Skill Detail Page:**
    - Render `README.md` / `SKILL.md` or `SKILL.zh.md`.
    - Show metadata (Author, Version, Repo Link, Update Date).
- **Registration Flow:**
    - Form to input "Git Repository URL".
    - Auto-discovery list with filters (Registered, Unregistered, Updatable).
    - System fetches `metadata.json` and bilingual documentation from the repo.

### 3.2 API (REST)
- `GET /api/skills`: Search and list skills.
- `GET /api/skills/:id`: Get details.
- `POST /api/skills`: Register a new skill (Auth required).
- `PUT /api/skills/:id`: Update version (Auth required, Owner only).

## 4. Security & Validation
- **Input Validation:** Zod schemas for all API routes.
- **Git Repo Validation:** Verify the provided URL is accessible and contains required files (`SKILL.md`).
- **Secret Scanning:** (Basic) Regex scan on `SKILL.md` content before saving to DB.
