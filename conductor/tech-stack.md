# Technology Stack: Internal Agent Skills Marketplace

## 1. Core Framework
*   **Full-Stack Framework:** [Next.js](https://nextjs.org/) (React)
    *   *Rationale:* Provides a seamless developer experience for both UI and API Routes, supporting Server-Side Rendering and static generation.
*   **Language:** TypeScript
    *   *Rationale:* Ensures type safety across the full stack, improving maintainability and reducing runtime errors.

## 2. Backend & Data
*   **Database:** PostgreSQL
    *   *Rationale:* Robust relational data storage for skill metadata (supporting bilingual descriptions), user relationships, and usage metrics (download counts).
*   **ORM:** Prisma
    *   *Rationale:* A modern, type-safe ORM that integrates perfectly with Next.js and PostgreSQL.
*   **Storage Layer:** Git Integration
    *   *Rationale:* Uploaded skills are stored and versioned directly within a Git repository, providing built-in history and developer-friendly access. Bilingual documentation (SKILL.md / SKILL.zh.md) is automatically indexed.

## 3. Frontend & Styling
*   **CSS Framework:** Tailwind CSS
    *   *Rationale:* Utility-first CSS for rapid, responsive, and highly customizable UI development.
*   **UI Components:** shadcn/ui
    *   *Rationale:* An open-source, accessible, and customizable component library built on Radix UI and Tailwind CSS. (Completely Free/MIT)

## 4. Infrastructure & DevOps
*   **Development Environment:** Podman
    *   *Rationale:* Used to containerize the database and other services locally, ensuring environment consistency.
*   **Authentication:** Git Platform OAuth (e.g., Internal GitLab/GitHub)
    *   *Rationale:* Leverages existing corporate Git identities for SSO and facilitates authorized Git-based storage operations.

## 5. Security & Validation
*   **Schema Validation:** Zod
    *   *Rationale:* Used for runtime validation of API requests and uploaded `metadata.json` files.
*   **Secret Scanning:** Integrated gitleaks or custom regex-based scanning during the upload process.
