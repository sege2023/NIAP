# NIAP- Token Wallet System with Paystack Integration

NIAP is a financial ledger system built to handle secure wallet top-ups and peer-to-peer value transfer. Unlike standard CRUD applications, NIAP prioritizes data consistency, concurrency control, and auditability—ensuring that every kobo is accounted for using a double-entry accounting architecture

## Architecture & Design Decisions

1. Layered Architecture (Service-Repository Pattern)
- The codebase is structured to enforce a strict separation of concerns, ensuring scalability and testability:
- **Controllers** (/controllers): Handle HTTP request/response lifecycles and input validation.

- **Services** (/services): Co**ntain the core business logic (e.g., fraud checks, balance calculations). This layer is decoupled from the database.


- **Data Access (Prisma)**: Manages strictly typed database interactions.

2. Database Strategy: Relational Integrity
Financial data requires strict ACID compliance. I chose PostgreSQL over NoSQL solutions to leverage:

- **Atomic Transactions**: Using prisma.$transaction, money movement operations (debit sender + credit receiver) either succeed together or fail together. This prevents "partial state" errors where money leaves one wallet but never arrives in the other.

- **Decimal Precision**: Utilizing @db.Decimal(10,2) instead of floating-point math to prevent rounding errors common in financial software.

3. The Unified Ledger Schema
The database uses a unified Transaction model to handle both external gateway events (Paystack) and internal P2P transfers.

- **Auditability**: Every internal transfer generates two immutable records (Debit & Credit), linked via a relatedTransactionId.

- **Performance**: This design allows for O(1) retrieval of a user's entire financial history without complex joins between "Sent" and "Received" tables.

## Tech Stack
- Frontend: Reactjs

- Backend: Node.js, Express

- Database: PostgreSQL (managed with Prisma ORM)

- Payment Integration: Paystack

- Authentication: Custom email-based authentication

- Deployment: (Coming soon — Cloudflare(client), Render(server).)

## 🛠 Setting up the app
### 1. Clone the repository
```bash
git clone https://github.com/sege2023/NIAP.git
```

### 2. Set up server
```bash
cd server
npm install
```

### 3. Set up environment variables
```bash
DATABASE_URL=your_postgres_connection_url
PAYSTACK_SECRET_KEY = your_secret_key
PAYSTACK_PUBLIC_KEY = your_public_key
```
### 4. Generate Prisma Client:
```bash
npx prisma generate
```
### 5. Apply databse migrations
```bash
npx prisma migrate dev
```
### 6. Start the development server:
```bash
npm run dev
```
### 7 .Set up client
```bash
cd client
npm install
```
### 8. Set up client env
```bash
SERVER_URL = http://localhost:9000
#and set it up in vite.config.ts
```
### 9. Start client
```bash
npm run dev
```

