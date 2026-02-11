# Product Guidelines: Internal Agent Skills Marketplace

## 1. Visual Identity & UI Design
*   **Developer-Centric Minimalism:** The interface should evoke a terminal-like aesthetic (e.g., monospace fonts, dark themes) but maintain high usability.
*   **High-Density Dashboard:** Use a card-based layout to present information efficiently, allowing users to browse dozens of skills at a glance.
*   **Hybrid Aesthetic:** Combine the "raw" feel of a CLI with the polished responsiveness of a modern web dashboard.

## 2. API Design & Integration
*   **RESTful Foundations:** Adhere to standard HTTP methods and JSON payloads for broad compatibility.
*   **CLI-Friendly UX:** Optimize API responses for terminal consumption (e.g., concise JSON, support for common headers) to make `curl` or script-based interactions seamless.
*   **Functional Minimalism:** Keep the API surface area small and focused on the core operations: Upload, Download, Search, and Update.

## 3. User Experience (UX) Principles
*   **Frictionless Contribution:** The upload process (both via Web and API) must be extremely simple, requiring minimal steps to share a new skill.
*   **Documentation as a First-Class Citizen:** Automatically render and beautifully display `SKILL.md` content. What a user writes in their Markdown file should be exactly what others see in the browser.

## 4. Development & Engineering Standards
*   **Simplicity over Complexity:** Avoid over-engineering. Favor readable, maintainable code that others can easily contribute to.
*   **Security-First Mentality:** Given the internal nature and the fact that we handle code, ensure robust authentication, ownership checks, and secret scanning are integrated into the core.
*   **Optimized Performance:** Ensure the platform remains snappy even as the number of registered skills and concurrent users grows.

## 5. Tone & Voice
*   **Collaborative & Community-Driven:** The language used in the UI and documentation should be encouraging and inclusive, framing the platform as a shared internal commons for knowledge exchange.
*   **Supportive Communication:** Focus on helping users succeed in sharing their skills rather than just enforcing rules.
