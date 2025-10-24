# Campaign Play Processor

## Introduction

### Client requirements
Build a small full-stack system that simulates receiving play events, processes them asynchronously, and provides a dashboard showing aggregated campaign performance. 

### Execution
 This project simulates a simplified RTB play log ingestion pipeline, the kind of async processing a DOOH company does.The API accepts play-events and immediately hands them off to a Redis-backed BullMQ queue. A dedicated worker drains the queue, writing each event into MongoDB for long-term storage. A React dashboard consumes the live dataset, grouping by campaign or screen, and includes tooling to simulate traffic for demos. Screens send play events are queued, processed, and aggregated for dashboards. Everything runs locally through Docker Compose for a consistent developer experience.

### Technologies Used
- **Node.js + TypeScript** for a strongly-typed Express API
- **BullMQ & Redis** to decouple ingestion from persistence and absorb bursts
- **MongoDB** as the primary store for historical play-events
- **React 18 + Vite/Parcel** with **MUI** and **Recharts** for the operator dashboard
- **Docker & Docker Compose** to orchestrate backend, frontend, Redis, and Mongo containers
- **TypeScript toolchain** (ts-node-dev, tsc) for development and builds

## Architecture Overview
- **API (`/backend/src/index.ts`)** exposes REST endpoints from (`/backend/src/routes/events.ts`) for submitting and reading events. The worker (`/backend/src/queue/worker.ts`) is started alongside the API so ingestion and processing share the same container.
- **Queue layer (`BullMQ`)** buffers traffic inside Redis. Jobs are named `play-events` and store the raw payload (`campaign_id`, `screen_id`, `timestamp`).
- **Persistence (`MongoDB`)** receives normalized documents in the `all_events` collection. The `connectToMongo` helper ensures a single shared client connection.
- **Frontend (`/frontend/src/useDashboardData`)** polls the API every 10 seconds and aggregates totals on the fly. Operators can simulate events manually or start an auto-runner (`useEventSimulator`) that fires randomized batches.
- **Local orchestration (`docker-compose.dev.yml`)** starts four containers: backend, frontend , Redis, and MongoDB.

## Project Structure
```
.
├── backend/           # Express API, BullMQ queue, Mongo integration
├── frontend/          # React dashboard, hooks, MUI-based UI components
└── docker-compose.dev.yml
```

## Setup and Installation

### Prerequisites
- **Docker Desktop** or Docker Engine
- **Docker Compose** (bundled with recent Docker Desktop releases)

### Quick start with Docker
```bash
git clone https://github.com/negreacristian/campaign-play-processor.git
cd campaign-play-processor
docker compose -f docker-compose.dev.yml up --build #use sudo if needed
```

Once the containers are healthy:
- API & worker: `http://localhost:3000`
- Dashboard: `http://localhost:5173`
- Redis: `localhost:6379`
- MongoDB: `mongodb://localhost:27017`

### Local development without Docker
1. **Backend**
   ```bash
   cd backend
   cp .env.dev .env.local  # optional: customize host/ports
   npm install
   npm run dev
   ```
   The dev server listens on `http://localhost:3000` and automatically compiles TypeScript on change.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Parcel defaults to `http://localhost:5173`. Update the fetch URLs in `frontend/src/api` if you bind the API elsewhere.

3. **Infrastructure**
   - Start Redis (`docker run --rm -p 6379:6379 redis`) and MongoDB (`docker run --rm -p 27017:27017 mongo`) or point the backend `.env` at managed instances.

### Environment configuration
The backend uses dotenv to load either `.env.dev` or `.env.prod` based on `NODE_ENV`. Key variables:
- `REDIS_HOST` / `REDIS_PORT`
- `MONGO_URI`
- `PORT` (defaults to `3000`)

When running locally without Docker, ensure `REDIS_HOST=localhost` and `MONGO_URI=mongodb://localhost:27017/campaignDB`.

## Usage

### Event ingestion API
- **POST `/all-events`**
  - **Body** _(JSON)_:  
    ```json
    {
      "campaign_id": "cmp-2025-001",
      "screen_id": "screen-101",
      "timestamp": "2025-02-04T12:34:56.789Z"
    }
    ```
  - **Responses**:
    - `200 OK`: `{ "message": "Event added to Redis queue" }`
    - `400 Bad Request`: missing required fields
  - **Notes**: The payload is validated for required fields, queued in Redis, then persisted asynchronously by the worker.

### Reporting API
- **GET `/all-events`**
  - Returns the raw event documents from MongoDB.
  - Example reply:
    ```json
    [
      {
        "_id": "678a3b8d5aa0ad5e8ec1ced7",
        "campaign_id": "cmp-2025-001",
        "screen_id": "screen-101",
        "timestamp": "2025-02-04T12:34:56.789Z"
      }
    ]
    ```
  - The frontend aggregates totals client-side, grouping by campaign or screen.

## Frontend Dashboard
- Navigate to `http://localhost:5173`.
- Toggle between **Campaigns** and **Screens** views using the navigation bar.
- Use **Simulate Event** to enqueue a single synthetic play; the list refreshes immediately.
- Use **Random Events** to start/stop automated batches (1–5 events every 10 seconds). The hook delays additional batches while one is in flight to avoid overlap.
- The **Stats List** shows the top 20 entities by total plays; the **Bar Chart** mirrors the same data for visual trends.

## Data & Persistence
- Mongo collection: `campaignDB.all_events`
- Stored schema:
  ```json
  {
    "campaign_id": "cmp-2025-001",
    "screen_id": "screen-101",
    "timestamp": "2025-02-04T12:34:56.789Z"
  }
  ```
- Each event runs through `worker.ts`, which logs ingestion as it inserts documents.

## Testing & Quality
- No automated test suite is included yet. The API is TypeScript-checked, and linting can be added via ESLint or Jest as next steps.
- Recommended manual checks:
  1. Submit a POST request and confirm the worker logs the ingestion.
  2. Run `GET /all-events` to verify Mongo persistence.
  3. Ensure the dashboard updates within 10 seconds and the chart matches the totals.
- Manual Event Ingestion (API Test) : You can simulate a single user event by sending a POST request directly to the backend API.

```bash
curl -X POST http://localhost:3000/events \
    -H "Content-Type: application/json" \
    -d '{"screen_id": "screen-102", "campaign_id": "cmp-2025-123", "timestamp": "2025-10-16T09:21:13Z"}'
  ```

## Troubleshooting
- **No events in dashboard**: Verify the backend container logs; ensure Redis and Mongo are reachable (`REDIS_HOST`, `MONGO_URI`).
- **CORS errors**: The backend enables CORS globally. Double-check ports when running without Docker.
- **Duplicate data**: The current implementation logs every event individually. Aggregations for deduplication or rollups can be added downstream.

## Next features

1. Add a toggle to pause/resume rocessing the data by stop/start the worker.
2. Introduce automated tests (Jest + Supertest) for API validation and worker behavior.
3. Externalize API base URLs through environment-configured frontend settings.
4. Deploy backend on AWS.

---
Thank you for taking the time to explore this service. If you have any questions or feedback, please feel free to reach out! 
