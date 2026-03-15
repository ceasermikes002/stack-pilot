**StackPilot**

*AI-Powered SaaS Stack Generator CLI*

**Product Requirements Document**

  ---------------- ------------------------------------------------------
  **Version:**     1.0 --- Initial Release

  ---------------- ------------------------------------------------------

  ---------------- ------------------------------------------------------
  **Status:**      Draft

  ---------------- ------------------------------------------------------

  ---------------- ------------------------------------------------------
  **Date:**        March 2026

  ---------------- ------------------------------------------------------

  ---------------- ------------------------------------------------------
  **Author:**      StackPilot Core Team

  ---------------- ------------------------------------------------------

  ---------------- ------------------------------------------------------
  **Document       Product Requirements Document (PRD)
  Type:**          

  ---------------- ------------------------------------------------------

*Confidential --- Internal Use Only*

**1. Executive Summary**

StackPilot is an open-source, AI-powered CLI tool that acts as a
developer\'s personal software architect. Rather than manually
selecting, configuring, and wiring together a SaaS tech stack from
scratch, developers simply describe what they want to build in plain
language --- and StackPilot recommends the ideal stack, explains its
reasoning, and scaffolds a production-ready project in seconds.

The tool is positioned at the intersection of three high-demand
categories: AI tooling, developer productivity, and SaaS starter kits.
It targets indie hackers, startup engineers, and hackathon participants
who need to move from idea to first commit as fast as possible.

> **Core value proposition: \"Describe your product. Get your stack.
> Ship faster.\"**

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Problem Solved**     Developers waste hours on stack selection,
                         config, and wiring before writing a single
                         feature line

  **Primary Mechanism**  AI architecture engine constrained to a curated,
                         validated set of stack options

  **Key Differentiator** Explains reasoning behind every stack decision
                         --- teaches while it generates

  **Target Audience**    Indie hackers, startup engineers, hackathon
                         participants, junior-to-mid developers

  **Monetisation         Hosted templates, premium stack add-ons,
  (Future)**             team/org CLI plans
  -----------------------------------------------------------------------

**2. Problem Statement**

**2.1 The Core Pain**

Every new SaaS project starts with the same exhausting ritual. A
developer has an idea. Before they write a single feature, they spend
anywhere from a few hours to several days:

-   Evaluating and debating framework choices

-   Reading compatibility documentation between libraries

-   Manually configuring authentication, database connections, and
    environment variables

-   Bootstrapping folder structures and establishing code conventions

-   Wiring together third-party services like payments, email, and
    storage

This is pure overhead --- none of it creates user value. For solo
founders and small teams operating under time constraints, it represents
a significant and recurring cost.

**2.2 Existing Tool Gaps**

Current tools solve narrow slices of the problem:

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **create-next-app**    Only scaffolds a Next.js app --- no auth,
                         payments, DB, or architecture guidance

  **create-t3-app**      Opinionated T3 stack only --- no flexibility, no
                         AI reasoning, single framework

  **supabase init**      Only initialises the Supabase backend --- no
                         frontend, no full-stack wiring

  **SaaS boilerplates**  Complete but expensive (\$100--\$300), not
                         CLI-native, not customisable by description

  **Yeoman generators**  Template-based, non-AI, quickly becomes
                         outdated, poor DX
  -----------------------------------------------------------------------

**2.3 Developer Insight**

The most commonly asked question in developer communities is not \"how
do I build feature X\" --- it is \"what stack should I use for project
Y.\" StackPilot turns that question into an automated, intelligent,
scaffolding event.

**3. Goals & Success Metrics**

**3.1 Product Goals**

-   Reduce time from project idea to runnable scaffolded code to under 3
    minutes

-   Provide transparent, educational stack reasoning that builds
    developer trust

-   Support the most common SaaS stack combinations used in production
    today

-   Be extensible enough that adding new stack options requires minimal
    effort

-   Achieve meaningful GitHub traction as an open-source project within
    90 days of launch

**3.2 Success Metrics**

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **GitHub Stars (30d    500+ stars within the first 30 days
  post-launch)**         

  **GitHub Stars (90d    2,000+ stars within 90 days
  post-launch)**         

  **Weekly Active Uses** 200+ project generations per week by end of
                         Month 2

  **Error / Crash Rate** \< 2% CLI generation failure rate across all
                         stack combinations

  **AI Recommendation    80%+ of users accept the AI-recommended stack
  Accuracy**             without modification

  **Community Adoption** Featured in at least 2 major developer
                         newsletters within 60 days

  **Contributor Growth** 5+ external contributors within the first 60
                         days of public release
  -----------------------------------------------------------------------

**4. Target Audience & User Personas**

**4.1 Primary Persona --- The Indie Hacker**

  -----------------------------------------------------------------------
  **Feature /           **Details**
  Component**           
  --------------------- -------------------------------------------------
  **Name**              Alex --- Solo Founder

  **Background**        Full-stack developer, building side projects on
                        weekends

  **Goal**              Validate an idea quickly and get to a working
                        product fast

  **Pain**              Spends more time on tooling than on the actual
                        product

  **How StackPilot      Describes the idea in one sentence; gets a
  Helps**               production-ready scaffold in under 3 minutes
  -----------------------------------------------------------------------

**4.2 Secondary Persona --- The Startup Engineer**

  -----------------------------------------------------------------------
  **Feature /           **Details**
  Component**           
  --------------------- -------------------------------------------------
  **Name**              Jordan --- Founding Engineer at an Early-Stage
                        Startup

  **Background**        Senior developer, building the first version of a
                        funded startup

  **Goal**              Make solid architectural decisions quickly
                        without spending days in debate

  **Pain**              Team debates stack choices and wastes early
                        sprint capacity

  **How StackPilot      AI explains architecture reasoning; team aligns
  Helps**               around a justified recommendation
  -----------------------------------------------------------------------

**4.3 Tertiary Persona --- The Hackathon Developer**

  -----------------------------------------------------------------------
  **Feature /           **Details**
  Component**           
  --------------------- -------------------------------------------------
  **Name**              Sam --- Hackathon Participant

  **Background**        Developer competing in a 24-48 hour hackathon

  **Goal**              Get a working full-stack app running in the first
                        hour

  **Pain**              Setup overhead destroys precious hackathon time

  **How StackPilot      One command, one prompt --- fully wired stack
  Helps**               scaffold ready to code
  -----------------------------------------------------------------------

**5. Product Overview & Core User Flow**

**5.1 High-Level User Journey**

The complete user journey from idea to scaffolded project consists of
five stages:

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Stage 1 --- Invoke** Developer runs npx stackpilot create in their
                         terminal

  **Stage 2 ---          Developer types a plain-language description of
  Describe**             what they are building

  **Stage 3 --- AI       AI analyses the description, extracts intent
  Analysis**             signals, and selects optimal stack options

  **Stage 4 ---          CLI displays a human-readable explanation of
  Reasoning Output**     every stack decision made

  **Stage 5 --- Stack    Developer reviews the recommended stack;
  Confirmation**         accepts, modifies, or overrides it

  **Stage 6 ---          CLI generates the full project, installs
  Scaffold**             dependencies, and configures services

  **Stage 7 --- Ready**  Developer opens the project and begins writing
                         features immediately
  -----------------------------------------------------------------------

**5.2 Example CLI Session**

> **\$ npx stackpilot create**
>
> **Welcome to StackPilot --- Your AI Software Architect**
>
> **What are you building?**
>
> **\> A marketplace where photographers can sell presets. I want to
> ship fast.**
>
> **Analysing project requirements\...**
>
> **Architecture Reasoning**
>
> **You want to move fast and validate quickly. A fullstack framework
> eliminates**
>
> **the overhead of maintaining a separate backend service. Next.js
> gives you**
>
> **API routes, server actions, and excellent Vercel deployment in one
> codebase.**
>
> **Since this is a marketplace with relational data (users, products,
> purchases),**
>
> **PostgreSQL with Prisma is the right fit. Clerk handles auth in
> minutes.**
>
> **Recommended Stack**
>
> **Frontend → Next.js 14 (App Router)**
>
> **Backend → Next.js API Routes (fullstack)**
>
> **Database → PostgreSQL + Prisma ORM**
>
> **Auth → Clerk**
>
> **Payments → Stripe**
>
> **Styling → Tailwind CSS + shadcn/ui**
>
> **Deployment → Vercel**
>
> **Generate this project? (Y/n) \_**

**6. Feature Specifications**

**6.1 AI Architecture Engine**

The AI engine is the core of the product. It accepts a plain-language
project description and returns a structured stack recommendation with
reasoning. The engine is deliberately constrained --- it can only choose
from the predefined list of supported stack options to guarantee every
recommendation is actionable and scaffoldable.

**Input Processing**

-   Accept freeform natural language descriptions of arbitrary length

-   Extract intent signals: speed-to-market, scale, real-time
    requirements, AI features, marketplace patterns, team size signals

-   Handle ambiguous or short descriptions gracefully with sensible
    defaults

**AI Output Contract**

The AI must return a structured JSON payload conforming to a strict
schema:

> **{ \"summary\": \[\"signal 1\", \"signal 2\"\], \"reasoning\": \"full
> explanation\...\", \"stack\": { \"frontend\": \"Next.js\",
> \"backend\": \"none\", \"database\": \"postgresql\", \"orm\":
> \"prisma\", \"auth\": \"clerk\", \"payments\": \"stripe\",
> \"styling\": \"tailwind-shadcn\", \"deployment\": \"vercel\" },
> \"addons\": \[\"resend\", \"cloudinary\"\] }**

**Constraint Enforcement**

-   AI must only select options from stacks.config.json --- no
    hallucinated libraries

-   If the AI selects an invalid option, the CLI falls back to a safe
    default with a warning

-   All AI calls include strict JSON-only system prompts with explicit
    option lists

**6.2 Supported Stack Options --- V1**

**Frontend**

  ------------------------------------------------------------------------
  **Frontend**          **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Next.js 14 (App     Fullstack SaaS, fast shipping,     **Core**
  Router) ✓**           Vercel-hosted                      

  Nuxt 4                Vue ecosystem preference,          **Core**
                        SSR-first apps                     

  Vue + Vite (SPA)      Lightweight SPA with separate      **Stretch**
                        backend                            
  ------------------------------------------------------------------------

**Backend**

  ------------------------------------------------------------------------
  **Backend**           **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **None (Fullstack     When frontend framework has        **Core**
  Framework) ✓**        built-in server capabilities       

  NestJS                Enterprise APIs, complex business  **Core**
                        logic, team projects               

  Express               Lightweight APIs, custom           **Stretch**
                        middleware requirements            

  Fastify               High-performance APIs,             **Stretch**
                        microservice patterns              
  ------------------------------------------------------------------------

**Database**

  ------------------------------------------------------------------------
  **Database**          **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **PostgreSQL ✓**      Relational data, marketplaces,     **Core**
                        SaaS with complex queries          

  Supabase (Postgres +  Fast shipping, built-in auth +     **Core**
  BaaS)                 storage + realtime                 

  MongoDB               Flexible schema, content           **Core**
                        platforms, document-heavy apps     

  Firebase (Firestore)  Realtime apps, mobile-first,       **Core**
                        Google ecosystem                   
  ------------------------------------------------------------------------

**ORM / DB Client**

  ------------------------------------------------------------------------
  **ORM**               **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Prisma ✓**          PostgreSQL / MySQL --- type-safe   **Core**
                        queries, excellent DX              

  Drizzle               PostgreSQL --- lightweight,        **Core**
                        SQL-like syntax, edge-compatible   

  Mongoose              MongoDB --- schema validation,     **Core**
                        mature ecosystem                   

  Supabase JS SDK       Supabase --- built-in client, no   **Core**
                        ORM needed                         

  Firebase SDK          Firebase --- built-in client, no   **Core**
                        ORM needed                         
  ------------------------------------------------------------------------

**Authentication**

  ------------------------------------------------------------------------
  **Auth**              **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Clerk ✓**           Fast setup, pre-built UI, user     **Core**
                        management dashboard               

  Auth.js (NextAuth)    Open-source, flexible providers,   **Core**
                        self-hosted                        

  Supabase Auth         When Supabase is selected as       **Core**
                        database                           

  Firebase Auth         When Firebase is selected as       **Core**
                        database                           
  ------------------------------------------------------------------------

**Payments**

  ------------------------------------------------------------------------
  **Payments**          **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Stripe ✓**          Default for all subscription and   **Core**
                        one-time payment flows             

  LemonSqueezy          Digital products, simpler tax      **Core**
                        handling, indie-friendly           

  None                  When the product has no payment    **Core**
                        requirement                        
  ------------------------------------------------------------------------

**Styling**

  ------------------------------------------------------------------------
  **Styling**           **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Tailwind CSS +      Default --- utility-first with     **Core**
  shadcn/ui ✓**         accessible component library       

  **Tailwind CSS only   When a custom design system is     **Core**
  ✓**                   preferred                          

  Chakra UI             Component-first,                   **Stretch**
                        accessibility-focused, React       
                        ecosystem                          
  ------------------------------------------------------------------------

**Deployment**

  ------------------------------------------------------------------------
  **Deployment**        **When to Use**                    **V1 Priority**
  --------------------- ---------------------------------- ---------------
  **Vercel ✓**          Default for Next.js ---            **Core**
                        zero-config deployment             

  Docker + Docker       Self-hosted, Railway, Render, VPS  **Core**
  Compose               deployments                        

  Railway config        Managed platform, low devops       **Core**
                        overhead                           

  None                  When developer handles deployment  **Core**
                        manually                           
  ------------------------------------------------------------------------

**6.3 Optional Add-on Modules**

After the core stack is confirmed, StackPilot offers optional add-on
modules that are highly common in SaaS products. The AI may pre-select
relevant add-ons based on the project description.

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Email**              Resend (default), SendGrid --- transactional
                         email setup with templates

  **File Storage**       Cloudinary (media-heavy), Supabase Storage, AWS
                         S3 --- configured SDK + env vars

  **Background Jobs**    BullMQ + Redis --- job queue setup with example
                         worker

  **Analytics**          PostHog (default), Plausible --- analytics
                         snippet + environment config

  **AI / LLM**           OpenAI SDK, Google Gemini SDK --- pre-configured
                         client with example usage

  **Rate Limiting**      Upstash Redis --- rate limiter middleware
                         configured for API routes

  **Feature Flags**      Posthog feature flags --- pre-wired flag
                         evaluation utility
  -----------------------------------------------------------------------

**6.4 Project Scaffolding Engine**

Once the stack is confirmed, the scaffolding engine generates a
complete, runnable project. Generation is template-based in V1 for
reliability and speed, with programmatic assembly planned for V2.

**V1 Output Structure --- Fullstack (Next.js)**

> **my-project/**
>
> **├── app/ \# Next.js App Router pages**
>
> **│ ├── (auth)/ \# Auth-gated routes**
>
> **│ ├── (marketing)/ \# Public-facing pages**
>
> **│ └── api/ \# API route handlers**
>
> **├── components/ \# shadcn/ui components**
>
> **├── lib/ \# Shared utilities, DB client, auth helpers**
>
> **├── prisma/ \# Schema + migrations**
>
> **├── public/ \# Static assets**
>
> **├── .env.example \# All required environment variables**
>
> **├── docker-compose.yml \# Local DB via Docker**
>
> **├── PRD.md \# AI-generated project PRD**
>
> **└── ARCHITECTURE.md \# Stack decisions + reasoning**

**What Gets Configured Automatically**

-   All environment variable keys pre-populated in .env.example

-   Database schema with User, Account, and Session models (Prisma) or
    equivalent

-   Authentication provider integration and middleware

-   Stripe webhook handler and subscription utility functions

-   Tailwind configuration with shadcn/ui component registry

-   ESLint + Prettier configured to the project\'s framework conventions

-   TypeScript configuration with strict mode enabled

-   Git repository initialised with a .gitignore covering all generated
    secrets

**6.5 Override & Customisation Flow**

After receiving the AI recommendation, developers can override any
component of the stack before generation begins. This is a critical
feature --- developers are opinionated and must feel in control.

-   \"Use recommended stack?\" --- defaults to Yes, allowing instant
    generation

-   If No: presents a categorical override menu (Frontend / Database /
    Auth / Payments / etc.)

-   Each override shows only the valid compatible options for the
    current stack state

-   Incompatible combinations are flagged with a clear warning before
    generation

Example incompatibility guard: if a developer selects Firebase as the
database but Prisma as the ORM, StackPilot warns that Prisma does not
support Firestore and suggests the Firebase SDK instead.

**6.6 AI-Generated Project Documentation**

After scaffolding, StackPilot generates two documentation files in the
project root. This is a significant differentiator that elevates
StackPilot from a generator into a founder and team tool.

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **PRD.md**             AI-drafted product requirements document based
                         on the project description --- includes problem
                         statement, feature ideas, user personas, and
                         success metrics

  **ARCHITECTURE.md**    Full stack decision log --- documents every
                         technology choice with the AI\'s reasoning,
                         tradeoffs considered, and links to official
                         documentation
  -----------------------------------------------------------------------

**7. AI Stack Decision Rules**

The AI architecture engine is guided by a set of deterministic decision
rules that are embedded in the system prompt. These rules ensure that
recommendations are consistently intelligent rather than arbitrary. The
rules are version-controlled and can be updated without a CLI release.

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Speed / MVP /        → Next.js fullstack, no separate backend, Vercel
  Validate / Fast**      deployment

  **Realtime / Live      → Supabase or Firebase (built-in realtime
  updates / Chat**       subscriptions)

  **Marketplace /        → PostgreSQL (relational), Stripe (payments),
  E-commerce / Sell**    Cloudinary if images

  **AI product / LLM /   → Next.js + OpenAI or Gemini SDK, Supabase for
  Chatbot**              vector if needed

  **Large team /         → NestJS backend, PostgreSQL, Prisma, Auth.js
  Enterprise / Complex   
  API**                  

  **Content platform /   → Next.js, PostgreSQL or MongoDB, no payments by
  Blog / CMS**           default

  **Mobile-first /       → Firebase Firestore + Firebase Auth + Firebase
  Firebase ecosystem**   Storage

  **Internal tool /      → Next.js, PostgreSQL, Clerk (easy SSO), no
  Dashboard**            payments

  **Image/media heavy**  → Cloudinary add-on recommended automatically

  **Subscription SaaS**  → Stripe default, PostgreSQL, Prisma, Clerk
  -----------------------------------------------------------------------

**8. CLI Technical Architecture**

**8.1 Technology Stack**

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Runtime**            Node.js 18+

  **Language**           TypeScript (strict mode)

  **Package              npm (npx stackpilot create --- zero install
  Distribution**         required)

  **AI Provider (V1)**   Anthropic Claude claude-sonnet-4-20250514 or
                         Google Gemini 1.5 Flash (configurable)

  **CLI Framework**      commander --- command parsing and subcommand
                         routing

  **Interactive          inquirer --- multi-choice, confirm, and list
  Prompts**              prompts

  **Terminal Output**    chalk --- coloured output, ora --- loading
                         spinners

  **File System**        fs-extra --- recursive file operations, template
                         copying

  **Process Execution**  execa --- running npm install, git init, prisma
                         generate

  **Template Engine**    Handlebars --- dynamic content injection into
                         template files

  **Config Format**      JSON (stacks.config.json) --- the master list of
                         supported options
  -----------------------------------------------------------------------

**8.2 Repository Structure**

> **stackpilot/**
>
> **├── src/**
>
> **│ ├── commands/ \# CLI command handlers**
>
> **│ │ └── create.ts \# Main create command**
>
> **│ ├── ai/**
>
> **│ │ ├── architect.ts \# AI API call + response parsing**
>
> **│ │ └── prompts.ts \# System prompts + constraint injection**
>
> **│ ├── generators/ \# Per-stack scaffold generators**
>
> **│ │ ├── nextjs.ts**
>
> **│ │ ├── nuxt.ts**
>
> **│ │ └── nestjs.ts**
>
> **│ ├── scaffolder/**
>
> **│ │ ├── index.ts \# Orchestrates template copy + config**
>
> **│ │ └── deps.ts \# Dependency installation runner**
>
> **│ ├── validator/ \# Stack compatibility checks**
>
> **│ └── utils/ \# Chalk helpers, file utilities**
>
> **├── templates/ \# One folder per stack combination**
>
> **│ ├── nextjs-prisma-clerk/**
>
> **│ ├── nextjs-supabase/**
>
> **│ └── nuxt-prisma/**
>
> **├── config/**
>
> **│ └── stacks.config.json \# Master stack option registry**
>
> **└── index.ts \# CLI entry point**

**8.3 AI API Integration**

The AI call is a single synchronous request made during the analysis
phase. To keep latency low and cost minimal, the system prompt is
compact and the response is constrained to JSON only.

-   Model: claude-sonnet-4-20250514 (primary) with Gemini 1.5 Flash as
    fallback

-   The API key is provided by the user on first run and stored in
    \~/.stackpilot/config.json

-   Response parsing validates every field against stacks.config.json
    before rendering

-   If the API call fails, the CLI falls back to interactive manual
    selection mode gracefully

-   Total AI latency target: under 4 seconds for the recommendation
    response

**9. V1 Scope --- In vs Out**

**9.1 In Scope for V1**

-   AI-powered stack recommendation from plain-language description

-   Transparent, readable reasoning output before stack confirmation

-   Stack override and customisation flow

-   Project scaffolding for: Next.js + Prisma + Clerk, Next.js +
    Supabase, Nuxt + Prisma

-   Automatic dependency installation (npm install)

-   Git initialisation (git init + initial commit)

-   Environment variable file generation (.env.example)

-   PRD.md and ARCHITECTURE.md AI-generated documentation

-   Docker Compose file for local database

-   Stripe payment scaffold (webhook handler + subscription utils)

-   Tailwind + shadcn/ui integration

-   Vercel deployment configuration (vercel.json)

**9.2 Out of Scope for V1**

-   Monorepo generation (Turborepo / Nx) --- planned for V2

-   GitHub repository auto-creation --- planned for V2

-   Devcontainer / VSCode workspace config --- planned for V2

-   \--startup-mode full SaaS skeleton (dashboard, billing, team
    management) --- planned for V2

-   React (Vite SPA), SvelteKit, Remix --- planned for V2 framework
    expansion

-   Fastify and Express backend scaffolding --- planned for V2

-   Background job scaffolding (BullMQ) --- planned for V2

-   Plugin/extension system for community stack contributions ---
    planned for V3

-   Web UI companion app --- post-V2

**10. Risks & Mitigations**

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **Template Maintenance HIGH --- as libraries update, templates go
  Burden**               stale. Mitigation: pin to major versions;
                         automate dependency checks with Renovate or
                         Dependabot

  **AI Hallucination /   MEDIUM --- unconstrained AI could recommend
  Bad Stack Choices**    invalid options. Mitigation: strict JSON
                         schema + constraint injection + post-validation
                         against stacks.config.json

  **Stack Combination    MEDIUM --- too many combinations creates
  Explosion**            unbounded template count. Mitigation: V1 limits
                         to \~6 core combinations; expand incrementally

  **Developer Trust in   MEDIUM --- developers may distrust AI-chosen
  AI Recommendations**   stacks. Mitigation: detailed reasoning output +
                         easy override flow + compatibility warnings

  **API Key Requirement  LOW-MEDIUM --- requiring an AI API key adds
  Friction**             onboarding friction. Mitigation: clear first-run
                         setup UX + consider a free hosted key tier in V2

  **Node Version         LOW --- different Node versions may break CLI.
  Incompatibilities**    Mitigation: enforce Node 18+ with engines field
                         in package.json
  -----------------------------------------------------------------------

**11. Roadmap**

  ------------------------------------------------------------------------
  **Phase**    **Timeline**     **Deliverables**
  ------------ ---------------- ------------------------------------------
  **V1.0**     Month 1--2       Core AI engine, Next.js + Nuxt
                                scaffolding, 6 core stack templates,
                                PRD.md + ARCHITECTURE.md generation, npm
                                publish

  **V1.1**     Month 2--3       NestJS backend support, Docker full-stack
                                templates, Railway config generation, bug
                                fixes from community feedback

  **V2.0**     Month 4--6       Turborepo monorepo mode, GitHub repo
                                auto-creation, VSCode devcontainer, React
                                Vite + SvelteKit frontends,
                                \--startup-mode

  **V2.1**     Month 6--8       BullMQ background jobs, AWS S3 +
                                Cloudinary add-ons, PostHog analytics
                                wiring, community stack plugin system
                                (RFC)

  **V3.0**     Month 8--12      Plugin/extension system,
                                community-contributed templates, web UI
                                companion, potential hosted team tier
  ------------------------------------------------------------------------

**12. Open Questions**

  -----------------------------------------------------------------------
  **Feature /            **Details**
  Component**            
  ---------------------- ------------------------------------------------
  **AI Provider          Should the CLI default to Claude or Gemini?
  Strategy**             Should it be user-configurable at init? Is there
                         a case for a free hosted key to reduce
                         onboarding friction?

  **Template vs          V1 uses templates for reliability. At what point
  Programmatic           does template sprawl justify switching to
  Assembly**             programmatic assembly? V2 or V3?

  **Monorepo Default**   Should V1 generate a monorepo (apps/web,
                         apps/api) by default, or keep it as a single-app
                         structure with monorepo as an opt-in in V2?

  **API Key Storage**    Is \~/.stackpilot/config.json an acceptable
                         place to store the AI API key, or should it use
                         the OS keychain?

  **Name Finalisation**  Is StackPilot the final name? Has the npm
                         package name been reserved? Are domain names
                         available?

  **Licensing**          MIT (fully open) vs BSL (open core with
                         commercial restrictions)? This affects the
                         GitHub growth strategy significantly.

  **Community            At what point does this need a CONTRIBUTING.md,
  Governance**           CODE_OF_CONDUCT.md, and formal issue triage
                         process?
  -----------------------------------------------------------------------

**StackPilot --- Product Requirements Document v1.0**

*This document is a living specification. Sections will be updated as
product decisions are made.*