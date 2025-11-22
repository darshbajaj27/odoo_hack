# StockMaster - Full Stack Integration Guide

## ✅ Integration Status

All components (Frontend, Backend, Database) are now properly linked and functional!

### System Architecture

```
Frontend (Next.js on :3000)
        ↓ (HTTP + JWT Token)
Backend (Express on :5000)
        ↓ (Prisma ORM)
Database (PostgreSQL)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔧 Configuration

### Backend Environment Variables (.env)

Already configured in `backend/.env`:
```env
DATABASE_URL="postgresql://stock_admin:StockMaster2025!@localhost:5432/stockmaster?schema=public"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=hackathon_secret_key_2025
JWT_EXPIRATION=7d
LOG_LEVEL=info
```

### Frontend Environment Variables (.env.local)

Already configured in `frontend/env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
**Output:**
```
🚀 Server running on port 5000
📊 API available at http://localhost:5000/api
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
**Output:**
```
✓ Ready in 1199ms
- Local:         http://localhost:3000
```

---

## 📡 API Integration

### Authentication Flow
1. **User Login** → `POST /api/auth/login`
2. **Token Stored** → Saved in localStorage
3. **All Requests** → Include `Authorization: Bearer {token}` header
4. **Auto-handled** → By `/lib/api.ts` utility functions

### Available API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - New user registration
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

#### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/adjust-stock` - Adjust stock quantity

#### Operations (Receipts/Deliveries)
- `GET /api/operations` - List all operations
- `GET /api/operations/:id` - Get operation details
- `POST /api/operations` - Create new operation
- `PATCH /api/operations/:id` - Update operation
- `DELETE /api/operations/:id` - Delete operation
- `POST /api/operations/:id/validate` - Mark as complete
- `POST /api/operations/:id/cancel` - Cancel operation

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-operations` - Recent operations
- `GET /api/dashboard/low-stock-alerts` - Low stock alerts
- `GET /api/dashboard/metrics` - Performance metrics

#### Moves
- `GET /api/moves` - List all moves
- `GET /api/moves/:id` - Get move details
- `POST /api/moves` - Create new move

#### Search
- `GET /api/search?q=query` - Global search
- `GET /api/search/products?q=query` - Search products
- `GET /api/search/operations?q=query` - Search operations

#### Settings
- `GET /api/settings` - Get settings
- `PATCH /api/settings` - Update settings
- `GET /api/settings/preferences` - Get preferences
- `PATCH /api/settings/preferences` - Update preferences

---

## 🎯 Frontend Features

### Auth Screen (`components/views/auth-screen.tsx`)
- ✅ Login with email/password
- ✅ Signup with name/email/password
- ✅ Token storage in localStorage
- ✅ Error/Success handling
- ✅ Demo credentials available

### Operations List (`components/views/operations-list-view.tsx`)
- ✅ Create new operation
- ✅ Filter by status
- ✅ Advanced filter panel
- ✅ Search functionality
- ✅ API-driven data

### Product Management (`components/views/product-management.tsx`)
- ✅ View products (Grid/Table)
- ✅ Add new product (with dialog)
- ✅ Adjust stock quantities
- ✅ Velocity deviation alerts
- ✅ API-driven data

### Operations Detail (`components/views/operation-detail-view.tsx`)
- ✅ Validate operations
- ✅ Print operation details
- ✅ Cancel operations
- ✅ Update product quantities

---

## 🔌 API Client Usage

### Frontend API Library (`lib/api.ts`)

```typescript
import { authAPI, productsAPI, operationsAPI } from '@/lib/api'

// Authentication
await authAPI.login('user@example.com', 'password')
await authAPI.signup('user@example.com', 'password', 'John Doe')

// Products
const products = await productsAPI.getAll(1, 10)
const product = await productsAPI.getById('prod-1')
await productsAPI.create({ name: 'New Product', sku: 'SKU-001' })

// Operations
const operations = await operationsAPI.getAll(1, 10)
const operation = await operationAPI.getById('op-1')
await operationsAPI.validate('op-1')
await operationsAPI.cancel('op-1')
```

### Custom React Hooks (`hooks/use-api.ts`)

```typescript
import { useAPI, useFetchAPI } from '@/hooks/use-api'

// For one-off calls
const { data, loading, error, call } = useAPI()
await call(() => productsAPI.getAll())

// For automatic fetching on mount
const { data, loading, error, refetch } = useFetchAPI(
  () => productsAPI.getAll(),
  [/* dependencies */]
)
```

---

## ✅ Test the Integration

### 1. Frontend Ready Check
```bash
# Visit frontend
http://localhost:3000
```

### 2. Backend Health Check
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok","timestamp":"2025-11-22T..."}
```

### 3. Test Login Flow
- Open http://localhost:3000
- Try login with demo credentials:
  - Email: manager@stockmaster.com
  - Password: demo123

### 4. Test Product API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/products
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
Get-Process -Name "node" | Stop-Process -Force

# Kill process on port 3000 (frontend)
Get-Process | Where-Object {$_.Port -eq 3000} | Stop-Process -Force
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in backend/.env
# Run: npm run prisma:migrate
```

### CORS Errors
```bash
# Ensure CORS_ORIGIN in backend/.env matches frontend URL
# Default: http://localhost:3000
```

### Token Not Found
```bash
# Check localStorage in browser DevTools
# Ensure login was successful
# Token should be stored after successful login
```

---

## 📊 Database Schema

The Prisma schema defines:
- **User** - Authentication & authorization
- **Product** - Inventory items
- **Operation** - Receipts/Deliveries
- **Move** - Stock movements
- **Location** - Warehouses/Vendors
- **Contact** - Vendors/Customers

See `backend/prisma/schema.prisma` for full details.

---

## 🔒 Security

- JWT tokens for authentication
- Bcrypt password hashing
- CORS protection enabled
- Token expiration: 7 days
- Secure headers configured

---

## 📝 Development Notes

### File Structure
```
frontend/
  ├── components/
  │   ├── views/        # Page components
  │   └── ui/           # Reusable UI components
  ├── hooks/
  │   └── use-api.ts    # Custom API hooks
  ├── lib/
  │   └── api.ts        # API client library
  └── env.local         # Frontend config

backend/
  ├── controllers/      # Business logic
  ├── routes/           # API endpoints
  ├── middleware/       # Auth, validation, errors
  ├── prisma/           # Database schema & migrations
  ├── config/           # Configuration files
  └── .env              # Backend config
```

---

## 🚀 Next Steps

1. **Database Population**: Run `npm run prisma:seed` in backend
2. **Sample Data**: Run `npm run db:sample` in backend  
3. **API Documentation**: Available at `http://localhost:5000/api-docs` (if Swagger enabled)
4. **Testing**: Run `npm test` in backend

---

## 📞 Support

For integration issues:
1. Check backend logs: `npm run dev` output
2. Check frontend console: Browser DevTools (F12)
3. Verify all .env files are properly configured
4. Ensure PostgreSQL is running and accessible

---

**Integration completed**: November 22, 2025 ✅
