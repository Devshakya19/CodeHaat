# CodeHaat

> India's #1 Digital Code Marketplace — Where Code Meets Commerce

[![CI](https://github.com/codehaat/codehaat/actions/workflows/ci.yml/badge.svg)](https://github.com/codehaat/codehaat/actions/workflows/ci.yml)

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Supabase account (free tier works)

### 1. Clone & Setup

```bash
git clone https://github.com/codehaat/codehaat.git
cd codehaat
```

### 2. Configure Environment

```bash
# Copy example env files
cp services/core-engine/.env.example services/core-engine/.env
cp services/ai-service/.env.example services/ai-service/.env
cp services/infra-worker/.env.example services/infra-worker/.env
cp services/realtime-service/.env.example services/realtime-service/.env

# Edit .env files with your Supabase credentials
```

### 3. Run with Docker

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js app |
| Core Engine | http://localhost:4001 | Rust API |
| AI Service | http://localhost:4002 | Python AI |
| Infra Worker | http://localhost:4003 | Go worker |
| Real-Time | ws://localhost:4004 | WebSocket |
| Redis | localhost:6379 | Cache & queues |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USERS (Browser)                       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              1. Frontend (Next.js :3000)                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           2. Core Engine (Rust :4001)                    │
└───────┬─────────────────────────┬───────────────────────┘
        │                         │
        ▼                         ▼
┌───────────────────┐   ┌─────────────────────────────────┐
│  3. AI Service    │   │  4. Infra Worker (Go :4003)     │
│  (Python :4002)   │   └─────────────────────────────────┘
└───────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  5. Real-Time (Node.js :4004)                           │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  6. Data Layer (Supabase + Redis)                       │
└─────────────────────────────────────────────────────────┘
```

---

## Services

| Service | Language | Port | Purpose |
|---------|----------|------|---------|
| Frontend | TypeScript | 3000 | User interface |
| Core Engine | Rust | 4001 | API gateway, transactions |
| AI Service | Python | 4002 | Recommendations, search |
| Infra Worker | Go | 4003 | Background jobs, GitHub |
| Real-Time | Node.js | 4004 | WebSocket notifications |
| Redis | - | 6379 | Cache, queues, pub/sub |

---

## Development

### Local Development (without Docker)

```bash
# Frontend
cd apps/web
npm install
npm run dev

# Core Engine (requires Rust)
cd services/core-engine
cargo run

# AI Service (requires Python)
cd services/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload

# Infra Worker (requires Go)
cd services/infra-worker
go run cmd/main.go

# Real-Time Service
cd services/realtime-service
npm install
npm run dev
```

### Docker Commands

```bash
# Build all services
docker-compose build

# Start specific service
docker-compose up core-engine

# Stop all services
docker-compose down

# View logs
docker-compose logs -f core-engine

# Rebuild after changes
docker-compose up -d --build
```

---

## Database

### Setup Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the migration SQL from `supabase/migrations/0001_init.sql`
4. Copy your project URL and keys to `.env` files

### Tables

- `profiles` — User profiles
- `categories` — Product categories
- `products` — Product listings
- `wallets` — User wallets
- `wallet_transactions` — Transaction history
- `orders` — Purchase orders
- `escrow` — Payment escrow
- `reviews` — Product reviews
- `notifications` — User notifications
- `disputes` — Dispute resolution

---

## Project Structure

```
codehaat/
├── apps/
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── features/       # Feature modules
│           │   ├── auth/       # Authentication
│           │   ├── browse/     # Buyer marketplace
│           │   ├── seller/     # Seller dashboard
│           │   ├── landing/    # Marketing page
│           │   └── developer/  # Seller marketing
│           ├── shared/         # Shared components
│           └── app/            # Next.js routes
│
├── services/
│   ├── core-engine/            # Rust API gateway
│   ├── ai-service/             # Python AI service
│   ├── infra-worker/           # Go background worker
│   └── realtime-service/       # Node.js WebSocket
│
├── supabase/
│   └── migrations/             # Database migrations
│
├── docs/                       # Documentation
│   ├── 01-PRD.md              # Project requirements
│   ├── 02-ARCHITECTURE.md     # System architecture
│   ├── 03-RULES.md            # Coding rules
│   ├── 04-DESIGN.md           # Design system
│   ├── 05-TRD.md              # Technical specs
│   ├── 06-APP-FLOW.md         # User flows
│   └── 07-BACKEND.md          # Backend & schema
│
└── docker-compose.yml          # Docker orchestration
```

---

## Documentation

- [01-PRD.md](docs/01-PRD.md) — Project Requirement Document
- [02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) — System Architecture
- [03-RULES.md](docs/03-RULES.md) — Rules & Conventions
- [04-DESIGN.md](docs/04-DESIGN.md) — UI/UX Design System
- [05-TRD.md](docs/05-TRD.md) — Technical Requirements
- [06-APP-FLOW.md](docs/06-APP-FLOW.md) — Application Flows
- [07-BACKEND.md](docs/07-BACKEND.md) — Backend & Schema

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Core API | Rust, Actix-Web |
| AI Service | Python, FastAPI |
| Worker | Go, goroutines |
| Real-Time | Node.js, WebSockets |
| Database | Supabase (PostgreSQL) |
| Cache | Redis |
| Auth | Supabase Auth |
| Payments | Razorpay (planned) |

---

## License

Private — CodeHaat. All rights reserved.

---

*Built with passion for the Indian developer community.*
