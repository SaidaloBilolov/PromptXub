# PromptXub — Enterprise AI Prompt & Media Showcase Platform

> **PromptXub** (promptxub.com) is an enterprise-grade AI Prompt & Media Showcase platform engineered with **Java 21 (Spring Boot 3)**, **PostgreSQL (Neon Serverless)**, **Cloudinary CDN**, and **Next.js 14 App Router** frontends — architected for **$0 total infrastructure cost**.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────┐
                               │  Neon.tech PostgreSQL  │
                               │  (Serverless Free Tier)│
                               └───────────▲────────────┘
                                           │
                                           │ HikariCP SSL
                                           │
┌──────────────────────────┐   HTTP/JSON   │  REST API (Port 8080)   ┌────────────────────────┐
│  Next.js 14 Showcase     ├───────────────┼─────────────────────────┤  Cloudinary Media CDN  │
│  (Port 3000 - Users)     │               │                         │  (Auto-Format WebP/MP4)│
└──────────────────────────┘               ▼                         └───────────▲────────────┘
                               ┌────────────────────────┐                        │
                               │  Spring Boot 3 Backend │────────────────────────┘
                               │  (Java 21 / Docker JRE)│   Direct Stream Upload
                               └───────────▲────────────┘
┌──────────────────────────┐               │
│  Next.js 14 Admin Panel  ├───────────────┘
│  (Port 3001 - Protected) │   Bearer JWT Auth
└──────────────────────────┘
```

---

## 🚀 Quick Start with Docker Compose

Run the entire microservice ecosystem locally with a single command:

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
- **Neon.tech Database**: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- **Cloudinary CDN**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **JWT Secret**: Any 256-bit string or generate a key.

### 2. Build & Launch Containers
```bash
docker compose up --build -d
```

### 3. Access Applications
| Application | URL | Default Credentials | Description |
| :--- | :--- | :--- | :--- |
| **Public Showcase** | `http://localhost:3000` | *Open Access* | User prompt discovery, live filters & 1-click copy |
| **Dedicated Admin Panel** | `http://localhost:3001` | `admin` / `Admin@PromptXub2025!` | Content moderation, analytics & drag-and-drop uploads |
| **Backend REST API** | `http://localhost:8080` | — | Spring Boot API & Actuator Health Endpoint |
| **API Healthcheck** | `http://localhost:8080/api/v1/health` | — | JSON status check |

### 4. Stop Containers
```bash
docker compose down
```

---

## 📦 Service Architecture & Ports

### 1. `promptxub-backend` (Port 8080)
- **Tech**: Java 21, Spring Boot 3.3.3, Spring Security (Stateless JWT), Spring Data JPA, Cloudinary SDK, Bucket4j.
- **Image**: Multi-stage `eclipse-temurin:21-jre-alpine` runtime (< 160MB).
- **JVM Optimizations**: Configured with `-XX:MaxRAMPercentage=75.0` specifically for Render.com free tier (512MB RAM).

### 2. `promptxub-showcase` (Port 3000)
- **Tech**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons, Google Fonts (Outfit & JetBrains Mono).
- **Features**: Live format filtering (ALL, PHOTO, VIDEO), sorting (Trending, Top Copied, Latest), responsive cards, 1-Click copy counter increment, modal prompt details.
- **Image**: Multi-stage `node:20-alpine` standalone runner (~120MB).

### 3. `promptxub-admin` (Port 3001)
- **Tech**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI styling.
- **Features**: JWT protected route layout, Analytics dashboard (Prompts, Copies, Views, Search logs), Drag-and-Drop photo & video dropzone with live preview, advanced prompt creator.
- **Image**: Multi-stage `node:20-alpine` standalone runner (~120MB).

---

## ⚡ Zero-Cost Cloud Deployment Guide ($0 Budget)

### Step A: Database Setup (Neon.tech)
1. Sign up at [neon.tech](https://neon.tech) (Free Tier provides 0.5 GB storage & autoscaling compute).
2. Create a database named `promptxub_db`.
3. Copy your pooled connection string (with `?sslmode=require`).

### Step B: Media CDN (Cloudinary)
1. Sign up at [cloudinary.com](https://cloudinary.com) (Free Tier provides 25 monthly credits).
2. Copy `Cloud Name`, `API Key`, and `API Secret` from your dashboard.

### Step C: Backend Deployment (Render.com)
1. Create a **New Web Service** from your GitHub repo.
2. Root directory: `promptxub-backend`.
3. Runtime: **Docker**.
4. Add environment variables:
   - `DATABASE_URL`: `jdbc:postgresql://<neon-endpoint>.neon.tech/promptxub_db?sslmode=require`
   - `DATABASE_USERNAME`: `<neon-user>`
   - `DATABASE_PASSWORD`: `<neon-password>`
   - `CLOUDINARY_CLOUD_NAME`: `<your_cloud_name>`
   - `CLOUDINARY_API_KEY`: `<your_api_key>`
   - `CLOUDINARY_API_SECRET`: `<your_api_secret>`
   - `JWT_SECRET`: `<your_jwt_secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://promptxub.com,https://admin.promptxub.com`
5. Copy your **Deploy Hook URL** from the Render settings.

### Step D: Frontend Deployments (Vercel / Cloudflare Pages)
1. **Showcase**: Connect GitHub repo, set root directory to `promptxub-showcase`. Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
2. **Admin Panel**: Connect GitHub repo, set root directory to `promptxub-admin`. Set `NEXT_PUBLIC_API_URL` to your Render backend URL.

---

## 🔄 CI/CD Pipelines (GitHub Actions)

Two automated workflows are configured in `.github/workflows/`:

1. **`backend-ci.yml`**:
   - Triggers on push to `main` with changes in `promptxub-backend/**`.
   - Packages Maven build with Java 21 Temurin.
   - Builds and verifies multi-stage Docker container.
   - Automatically pings Render.com deploy hook to redeploy zero-downtime container.

2. **`frontends-ci.yml`**:
   - Triggers on push to `main` with changes in `promptxub-showcase/**` or `promptxub-admin/**`.
   - Installs dependencies & runs Next.js standalone typecheck builds.
   - Builds and tests standalone Docker images for both applications.
   - Triggers frontend deployment webhooks.

### GitHub Repository Secrets
Add these secrets under **Settings > Secrets and variables > Actions**:
- `RENDER_BACKEND_DEPLOY_HOOK_URL`: Your Render Web Service deploy webhook.
- `VERCEL_SHOWCASE_DEPLOY_HOOK` (Optional): Vercel/Cloudflare deploy hook for public showcase.
- `VERCEL_ADMIN_DEPLOY_HOOK` (Optional): Vercel/Cloudflare deploy hook for admin portal.

---

## 📄 License
MIT License. Built for the modern generative AI community.
