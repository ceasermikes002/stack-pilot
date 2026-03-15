# StackPilot Implementation Plan & Finalized Strategy

Based on the Product Requirements Document (PRD) and our clarifying discussions, here is the implementation strategy. We are focusing heavily on **extensibility**, **testing**, and **high code quality**. All generated projects will be monorepos where frontend and backend live in the same codebase. 

## Finalized Approach
1. **AI Provider (V1):** Google Gen AI (`@google/genai`).
2. **Template Sourcing:** Built from scratch alongside the CLI implementation.
3. **Template Manifests:** `manifest.json` embedded in each template folder to handle dependencies and post-install commands dynamically.
4. **Testing Framework:** Vitest.
5. **Package Management:** Dynamically choose based on user preference (`npm`, `yarn`, `pnpm`, `bun`).
6. **Documentation:** All `.md` documents, guides, and plans will reside in the `docs/` folder.

## Feature Segmentation

I have segmented the project into 6 distinct, testable features:

### 1. Core CLI & Foundation (Feature 1) - **DONE**
- **Goal:** Set up the Node.js/TypeScript environment, Vitest, `commander` routing, and terminal UI utilities (`chalk`, `ora`).
- **Agnostic Design:** The entry point (`index.ts`) will dynamically load commands and options based on metadata, avoiding hardcoded CLI flags.
- **Tests:** Unit test the CLI parser and utility functions.

### 2. Configuration Engine & Validation (Feature 2) - **DONE**
- **Goal:** Building the registry from `stacks.config.json` and validating stack compatibilities.
- **Agnostic Design:** A rules engine reading constraints from JSON. Constraints map dependencies instead of explicit `if/else` framework checks.
- **Tests:** Validate engine with compatible and incompatible JSON payloads.

### 3. AI Architecture Engine (Feature 3) - **DONE**
- **Goal:** Ingest project descriptions, interact with `@google/genai`, parse JSON responses, and securely manage API keys.
- **Agnostic Design:** The prompt generator maps `stacks.config.json` into a text block dynamically, so the LLM is always aware of the *current* valid capabilities.
- **Tests:** Mock AI clients, ensure prompts contain the config schema, and parse malformed JSON responses gracefully.

### 4. Interactive Flow & Override Management (Feature 4) - **DONE**
- **Goal:** Drive the `inquirer` prompt sessions. Display reasoning, then allow users to override choices safely.
- **Agnostic Design:** Menus are generated iteratively from the validation engine's current valid options based on node selections.
- **Tests:** Unit test the interactive state machine to assure incompatible overrides trigger fallback errors.

### 5. Scaffolding & Templating Engine (Feature 5) - **DONE**
- **Goal:** Reading the selected stack profile, rendering `Handlebars` files (.env variables, PRD, Architecture), copying folders, and rewriting structural variables.
- **Agnostic Design:** The Scaffolder reads a `manifest.json` from the targeted template directory, dictating the folder structure (frontend/backend in the monorepo) and commands to run.
- **Tests:** Handled by direct scaffolding engine runs simulating `npx`.

### 6. Post-Scaffolding & Execution (Feature 6) - **DONE**
- **Goal:** Running shell commands (git init, dependencies) using `execa` with the user-selected package manager (`npm`, `yarn`, `pnpm`, `bun`).
- **Tests:** Implemented inline parameter substitution for dynamic PM usage (`%PM_FLAG%`).
