# CodeHaat

> India's #1 Digital Code Marketplace — Where Code Meets Commerce

<div align="center">
  <img src="assets/banner.jpg" alt="CodeHaat Banner" />
</div>

---

## What is CodeHaat?

CodeHaat is a two-sided digital goods marketplace where developers can buy and sell production-grade code assets. Unlike traditional platforms that distribute static .zip files, CodeHaat delivers code directly to buyers' GitHub accounts as private repositories.

**Key Features:**
- GitHub repo delivery (no .zip files)
- 2.5% commission (lowest in market)
- Live preview system
- Escrow payment protection
- INR payments with Razorpay

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

### 3. Setup Database

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run `supabase/FRESH_DATABASE.sql`
4. Copy your project URL and anon key to `apps/web/.env.local`

### 4. Run with Docker

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 5. Access Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js app |
| Core Engine | http://localhost:4001 | Rust API |
| AI Service | http://localhost:4002 | Python AI |
| Infra Worker | - | Go worker (no HTTP) |
| Real-Time | ws://localhost:4004 | WebSocket |
| Redis | localhost:6379 | Cache & queues |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | User interface |
| **Styling** | Tailwind CSS v4, shadcn/ui | Design system |
| **Core API** | Rust, Actix-Web | API gateway, transactions |
| **AI Service** | Python, FastAPI | Recommendations, search |
| **Worker** | Go | Background jobs, GitHub |
| **Real-Time** | Node.js, WebSockets | Live notifications |
| **Database** | Supabase (PostgreSQL) | Data storage |
| **Cache** | Redis | Queues, caching, pub/sub |
| **Auth** | Supabase Auth | Authentication |
| **Payments** | Razorpay | INR payments |

---

## Project Structure

```
codehaat/
├── apps/
│   └── web/                          # Next.js frontend
│       └── src/
│           ├── features/             # Feature modules
│           │   ├── auth/             # Authentication pages
│           │   ├── browse/           # Buyer marketplace
│           │   ├── products/         # Product detail
│           │   ├── seller/           # Seller dashboard
│           │   ├── landing/          # Marketing page
│           │   ├── developer/        # Seller marketing
│           │   └── pages/            # Company & Legal pages
│           ├── shared/               # Shared components & utils
│           └── app/                   # Next.js routes
│
├── services/
│   ├── core-engine/                  # Rust API gateway
│   ├── ai-service/                   # Python AI service
│   ├── infra-worker/                 # Go background worker
│   └── realtime-service/             # Node.js WebSocket
│
├── supabase/
│   ├── FRESH_DATABASE.sql           # Full database setup
│   ├── DATABASE_FULL_SETUP.sql      # Idempotent setup
│   └── migrations/                  # Database migrations
│
├── assets/
│   └── LOGO-DESIGN.md              # Brand assets guide
│
├── docs/                             # Documentation
│   ├── 01-PRD.md                    # Project requirements
│   ├── 02-ARCHITECTURE.md           # System architecture
│   ├── 03-RULES.md                  # Coding rules
│   ├── 04-DESIGN.md                 # Design system
│   ├── 05-TRD.md                    # Technical specs
│   ├── 06-APP-FLOW.md               # User flows
│   └── 07-BACKEND.md                # Backend & schema
│
└── docker-compose.yml                # Docker orchestration
```

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
│              Pure UI — no direct DB access               │
└─────────────────────────┬───────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│           2. Core Engine (Rust :4001)                    │
│           All data operations                            │
└───────┬─────────────────────────┬───────────────────────┘
        │                         │
        ▼                         ▼
┌───────────────────┐   ┌─────────────────────────────────┐
│  3. AI Service    │   │  4. Infra Worker (Go)            │
│  (Python :4002)   │   │  Background jobs, GitHub         │
└───────────────────┘   └─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  5. Real-Time (Node.js :4004)                           │
│  WebSocket notifications                                │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  6. Data Layer (Supabase + Redis)                       │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

The frontend is a **pure UI layer** — it only handles:
- **Auth**: Login, register, password reset (via Supabase Auth)
- **UI**: Rendering pages, forms, and components

All data operations go through the **Backend API** (Rust Core Engine).

```
Frontend → Backend API → Supabase Database
   ↑           ↑
Auth only    Data ops
```

---

## API Endpoints (Rust Core Engine)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/verify` | Verify JWT token |
| GET | `/api/profile/:id` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| GET | `/api/products` | List products (search/filter) |
| GET | `/api/products/:id` | Get product detail |
| GET | `/api/seller/products` | List seller's products |
| POST | `/api/seller/products` | Create product |
| PUT | `/api/seller/products/:id` | Update product |
| DELETE | `/api/seller/products/:id` | Delete product |
| GET | `/api/seller/stats` | Get seller statistics |
| GET | `/api/wallet` | Get wallet balance |
| POST | `/api/wallet/topup` | Top up wallet |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get order detail |
| GET | `/api/reviews/:product_id` | Get product reviews |
| POST | `/api/reviews` | Create review |
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark notification read |

---

## Database

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (buyers & sellers) |
| `categories` | Product categories (6 seeded) |
| `products` | Product listings |
| `wallets` | User wallet balances |
| `wallet_transactions` | Transaction history |
| `orders` | Purchase orders |
| `escrow` | Payment escrow |
| `reviews` | Product reviews |
| `notifications` | User notifications |
| `disputes` | Dispute resolution |

### Setup

Run `supabase/FRESH_DATABASE.sql` in Supabase SQL Editor for a fresh database.

---

## Pages

### Public Pages
| Route | Page |
|-------|------|
| `/` | Landing page (marketing) |
| `/developer` | Seller marketing page |
| `/browse` | Product marketplace |

### Auth Pages
| Route | Page |
|-------|------|
| `/login` | Sign in |
| `/register` | Create buyer account |
| `/developer-register` | Create seller account |
| `/forgot-password` | Reset password |
| `/reset-password` | Set new password |
| `/verify` | Email verification |

### Buyer Pages (role: user)
| Route | Page |
|-------|------|
| `/browse` | Product browsing home |
| `/products/[id]` | Product detail page |

### Seller Pages (role: developer)
| Route | Page |
|-------|------|
| `/seller` | Seller dashboard |
| `/seller/products` | Product list |
| `/seller/products/new` | Create product |
| `/seller/profile` | Seller profile |
| `/seller/settings` | Seller settings |
| `/seller/earnings` | Earnings (coming soon) |

### Company Pages
| Route | Page |
|-------|------|
| `/about` | About CodeHaat |
| `/blog` | Blog posts |
| `/careers` | Career opportunities |
| `/contact` | Contact form |
| `/press` | Press kit & brand assets |

### Legal Pages
| Route | Page |
|-------|------|
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/refund` | Refund Policy |
| `/license` | License Agreement |
| `/cookies` | Cookie Policy |

---

## Development

### Local Development

```bash
# Frontend
cd apps/web
npm install
npm run dev    # Runs on port 3001

# Backend (requires Rust)
cd services/core-engine
cargo run      # Runs on port 4001
```

### Docker Development

```bash
docker compose up -d          # Start all services
docker compose up -d --build  # Rebuild after changes
docker compose logs -f        # View logs
docker compose down           # Stop all services
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [01-PRD.md](docs/01-PRD.md) | Project Requirement Document |
| [02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) | System Architecture |
| [03-RULES.md](docs/03-RULES.md) | Rules & Conventions |
| [04-DESIGN.md](docs/04-DESIGN.md) | UI/UX Design System |
| [05-TRD.md](docs/05-TRD.md) | Technical Requirements |
| [06-APP-FLOW.md](docs/06-APP-FLOW.md) | Application Flows |
| [07-BACKEND.md](docs/07-BACKEND.md) | Backend & Schema |
| [LOGO-DESIGN.md](assets/LOGO-DESIGN.md) | Brand Assets Guide |

---

## Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### Backend (`services/core-engine/.env`)

```env
PORT=4001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
```

---

## License

Private — CodeHaat. All rights reserved.

---

*Built with passion for the Indian developer community.*
