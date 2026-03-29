# Khzenti Backend - Email Whitelist API

A robust backend service for managing email whitelist submissions with comprehensive validation, IP-based restrictions, and rate limiting. Built with Node.js, TypeScript, Express, Prisma, and Supabase.

## 🚀 Features

- ✅ **Email Validation**: RFC 5322 compliant email format validation
- ✅ **Unique Email Constraint**: Prevents duplicate email registrations
- ✅ **IP-Based Protection**: One submission per IP address
- ✅ **Disposable Email Blocking**: Blocks temporary/throwaway email services
- ✅ **Rate Limiting**: Prevents API abuse (3 requests per 15 minutes)
- ✅ **TypeScript**: Full type safety
- ✅ **Prisma ORM**: Type-safe database operations
- ✅ **Supabase**: PostgreSQL database hosting
- ✅ **Security**: Helmet.js, CORS, input sanitization
- ✅ **Error Handling**: Comprehensive error responses

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier available)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd khzenti_back
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Admin Credentials (set your own secure credentials)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

**To get your Supabase DATABASE_URL:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string under "Connection string" → "URI"
5. Replace `[YOUR-PASSWORD]` with your database password

### 3. Setup Database with Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR create and run migrations (for production)
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Add Email to Whitelist

**POST** `/api/whitelist`

Add a new email to the whitelist.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully added to whitelist",
  "data": {
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid email format
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

- **403 Forbidden** - IP already used or disposable email
```json
{
  "success": false,
  "message": "This IP address has already submitted an email"
}
```

- **409 Conflict** - Email already registered
```json
{
  "success": false,
  "message": "Email already registered in whitelist"
}
```

- **429 Too Many Requests** - Rate limit exceeded
```json
{
  "success": false,
  "message": "You have exceeded the whitelist submission limit. Please try again later"
}
```

#### 2. Get All Whitelist Entries (Admin Only)

**POST** `/api/whitelist/admin`

Retrieve all whitelist entries. **Requires authentication.**

**Request Body:**
```json
{
  "email": "your-admin-email@example.com",
  "password": "your-secure-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Whitelist entries retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-03-29T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized** - Missing credentials
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

- **403 Forbidden** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 3. Health Check

**GET** `/health`

Check server status.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-29T10:30:00.000Z"
}
```

## 🔒 Validation Rules

### Email Constraints:
1. ✅ Must be a valid email format (RFC 5322)
2. ✅ Must be unique (no duplicates)
3. ✅ Cannot be from disposable email services
4. ✅ Automatically normalized (lowercase, trimmed)

### IP Constraints:
1. ✅ One submission per IP address
2. ✅ IP is automatically extracted from headers (supports proxies)

### Rate Limiting:
- Global API: 5 requests per 15 minutes
- Whitelist endpoint: 3 requests per 15 minutes

## 📁 Project Structure

```
khzenti_back/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/
│   │   └── whitelist.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── services/
│   │   └── whitelist.service.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── ipHelper.ts
│   │   └── validators.ts
│   └── server.ts              # Main entry point
├── .env                       # Environment variables
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build           # Compile TypeScript to JavaScript

# Production
npm start               # Run production server

# Prisma
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Create and run migrations
npm run prisma:push     # Push schema to database (dev)
npm run prisma:studio   # Open Prisma Studio (database GUI)
```

## 🧪 Testing with cURL

### Add Email to Whitelist
```bash
curl -X POST http://localhost:3000/api/whitelist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Get All Entries (Admin)
```bash
curl -X POST http://localhost:3000/api/whitelist/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"your-admin-email@example.com","password":"your-secure-password"}'
```

## 🔧 Database Schema

```prisma
model Whitelist {
  id          String   @id @default(uuid())
  email       String   @unique
  ipAddress   String
  userAgent   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([ipAddress])
  @@index([email])
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Make sure to set:
- `NODE_ENV=production`
- `DATABASE_URL` (your Supabase production URL)
- `ALLOWED_ORIGINS` (your frontend URLs)
- `ADMIN_EMAIL` (secure admin email)
- `ADMIN_PASSWORD` (strong secure password)

### Deploy to Various Platforms

**Vercel/Netlify:**
- Add environment variables in dashboard
- Set build command: `npm run build`
- Set start command: `npm start`

**Railway/Render:**
- Connect your repository
- Add environment variables
- Platform will auto-detect Node.js app

## 🔐 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable origin restrictions
- **Admin Authentication**: Password-protected admin endpoints
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **IP Normalization**: Handles proxies correctly

> ⚠️ **Important**: For production, use strong passwords for admin credentials and consider implementing JWT-based authentication or OAuth instead of hardcoded credentials.
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **IP Normalization**: Handles proxies correctly

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for secure email whitelist management
