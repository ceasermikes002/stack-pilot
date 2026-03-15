# ✸ StackPilot — Your AI Software Architect

**Describe your product. Get your stack. Ship faster.**

StackPilot is an AI-powered CLI tool that act as a personal software architect. Instead of wasting hours debating frameworks or wiring together libraries, you simply describe what you're building in plain language. StackPilot recommends the ideal technical stack, explains its architectural reasoning, and scaffolds a production-ready project in seconds.

---

## Quick Start

You can run StackPilot instantly without installing it locally:

```bash
npx stack-pilot-architect create
```

Or install it globally:

```bash
npm install -g stack-pilot-architect@latest
```

### 1. Initialization
First, configure your AI provider (Google Gemini, Anthropic, or OpenAI):

```bash
stack-pilot-architect init
```

### 2. Create a Project
Now you're ready to start building your next big idea:

```bash
stack-pilot-architect create
```

## Key Features

- **AI Architecture Engine**: Analyzes your project description to identify intent signals like "marketplaces", "real-time updates", or "MVPs".
- **Transparent Reasoning**: Never guest why a technology was chosen. The CLI explains the "why" behind every layer of your stack.
- **Production-Ready Scaffolds**: Generates deep-integrated monorepos using TurboRepo, Prisma, Tailwind, and more.
- **Centralized Workspace**: All projects are automatically organized in `Documents/StackPilot/projects/` for a clean dev environment.
- **Deployment Ready**: Automatic injection of Docker, Vercel, or Railway configurations based on your stack.

## Supported Stack Options (V1)

| Category | Options |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), Nuxt 3 |
| **Backend** | Fullstack (built-in), NestJS, Express, Fastify |
| **Database** | PostgreSQL, Supabase, MongoDB, Firebase |
| **ORM** | Prisma, Drizzle, Mongoose, SDK-native |
| **Auth** | Clerk, Auth.js (NextAuth), Supabase Auth |
| **Deployment** | Vercel, Docker, Railway, None |

---

## Development

### Running Tests
We maintain a robust test suite to ensure recommendation accuracy and scaffolding integrity.

```bash
npm test
```

### Building from Source
```bash
npm run build
```

---

## Contributing

We welcome contributions! Please see our [Developer Documentation](dev-docs/index.html) for architectural goals and technical guides.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License
Distributed via NPM under the ISC License. See `package.json` for details.

---
Built by Chima
