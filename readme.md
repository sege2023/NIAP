# NIAP- Token Wallet System with Paystack Integration

## Tech Stack
-Frontend: Reactjs

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

