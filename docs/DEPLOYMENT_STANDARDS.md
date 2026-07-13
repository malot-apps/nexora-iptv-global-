# 🚀 Deployment Guidelines & Environment Configurations

This document outlines the hosting targets, continuous integration pipelines, build tasks, and environment constraints for compiling **Nexora IPTV Global**.

---

## 🏗️ 1. Production Build Phase

Nexora is designed to be fully compatible with major serverless hosting providers (such as Vercel or Netlify), static storage networks, and standard container engines like Docker on Cloud Run.

To generate a highly optimized, production-ready static asset bundle:

```bash
# Set production environment node flags
export NODE_ENV=production

# Compile application
npm run build
```

This trigger:
1. Runs ESLint quality checks to locate syntax exceptions.
2. Compiles TypeScript variables and dependencies natively.
3. Invokes Next.js compilers to create minimized chunks under the `.next/` directory.
4. Outputs ready static assets in `dist/` or equivalent target compilation maps.

---

## 🔒 2. Environment Security (API Keys and Credentials)

- **Gemini Key Handling**: If integrating server-side capabilities (such as automated playlist cataloguing or metadata translations), use `process.env.GEMINI_API_KEY`.
- **Client Exclusions**: Never prepend the prefix `NEXT_PUBLIC_` to sensitive streaming keys, third-party authentication profiles, or system endpoints. 
- **Lazy Load SDKs**: Initialize any third-party streaming clients, token verifiers, or cloud databases inside lazy wrappers rather than at module load time to prevent startup exceptions when keys are absent.

```typescript
// ✅ Good lazy-initialization pattern
let dbInstance: any = null;

export function getDatabase() {
  if (!dbInstance) {
    const key = process.env.PERSISTENCE_DB_KEY;
    if (!key) {
      throw new Error("Missing PERSISTENCE_DB_KEY variables");
    }
    dbInstance = initializeDb(key);
  }
  return dbInstance;
}
```

---

## 🐳 3. Containerized Deployments (Docker)

To bundle Nexora inside lightweight Linux containers:

```dockerfile
# Use official LTS Node.js runtime base image
FROM node:22-alpine AS runner

WORKDIR /app

# Copy essential package configs
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy compiled Next.js build directories
COPY .next ./.next
COPY public ./public
COPY app/globals.css ./app/globals.css

# Bind listener port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run target start script
CMD ["npm", "run", "start"]
```

### Run Container Local Commands
```bash
# Build the docker container image
docker build -t nexora-iptv-global .

# Run container on port 3000
docker run -p 3000:3000 nexora-iptv-global
```
- **Port Binding**: Ensure your development and container proxies route strictly to **port 3000** for standard port mapping compatibility.
- **HMR Disables**: For optimal preview speeds on staging servers, ensure Hot Module Replacement is disabled by setting `DISABLE_HMR=true` in staging parameters.
