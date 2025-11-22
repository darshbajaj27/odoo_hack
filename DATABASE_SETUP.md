# Database Setup & PostgreSQL Configuration

## Current Database Status

✅ **Properly Configured and Running**

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: stockmaster
- **User**: stock_admin
- **Password**: StockMaster2025!
- **Connection String** (in .env):
  ```
  DATABASE_URL="postgresql://stock_admin:StockMaster2025!@localhost:5432/stockmaster?schema=public"
  ```

---

## Database Setup Instructions

### 1. Create PostgreSQL User & Database

Run these SQL commands in PostgreSQL:

```sql
-- Create user
CREATE USER stock_admin WITH PASSWORD 'StockMaster2025!';

-- Create database
CREATE DATABASE stockmaster OWNER stock_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stockmaster TO stock_admin;
GRANT USAGE ON SCHEMA public TO stock_admin;
GRANT CREATE ON SCHEMA public TO stock_admin;
```

### 2. Initialize Prisma Schema

Run in backend directory:

```bash
# Generate Prisma client
npm run prisma:generate

# Create or update database schema
npm run prisma:migrate

# (Optional) Reset database
npm run prisma:reset

# (Optional) Seed with sample data
npm run prisma:seed
```

---

## Database Models

### User
- Stores user accounts for authentication
- Fields: id, email, password, name, role, status, createdAt, updatedAt

### Product
- Inventory items/SKUs
- Fields: id, sku, name, category, description, onHand, freeToUse, createdAt, updatedAt

### Operation
- Receipts and deliveries
- Fields: id, type, status, sourceLocationId, destinationLocationId, sourceDocumentId, scheduledDate, createdAt, updatedAt

### OperationLine
- Individual items in an operation
- Fields: id, operationId, productId, demandQty, doneQty

### Move
- Stock movements between locations
- Fields: id, productId, fromLocationId, toLocationId, quantity, notes, createdAt, updatedAt

### Location
- Warehouses, vendors, customers, etc.
- Fields: id, name, type, address, description, createdAt, updatedAt

### Contact
- Vendors and customers
- Fields: id, name, email, phone, address, type, createdAt, updatedAt

---

## Prisma Commands Reference

```bash
# Generate Prisma Client
npm run prisma:generate

# Create/update database schema from prisma.schema
npm run prisma:migrate

# Reset database (dangerous - removes all data)
npm run prisma:reset

# Seed database with initial data
npm run prisma:seed

# Open Prisma Studio (GUI for database)
npx prisma studio
```

---

## Verifying Connection

### From Node.js

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const user = await prisma.user.count();
    console.log('✅ Database connected! Users:', user);
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

### From PostgreSQL CLI

```bash
psql -U stock_admin -d stockmaster -h localhost -c "SELECT COUNT(*) FROM users;"
```

---

## Common Issues & Solutions

### Issue: "ECONNREFUSED" - Cannot connect to database
**Solution**: 
- Verify PostgreSQL is running
- Check host/port (default: localhost:5432)
- Verify credentials in DATABASE_URL

### Issue: "relation does not exist"
**Solution**: 
- Run `npm run prisma:migrate`
- Run `npm run prisma:reset` if needed

### Issue: "permission denied"
**Solution**:
- Verify user has correct privileges
- Run GRANT commands above
- Check connection string format

### Issue: "schema public does not exist"
**Solution**:
- Run: `psql -U stock_admin -d stockmaster -c "CREATE SCHEMA IF NOT EXISTS public;"`

---

## Backup & Restore

### Backup Database
```bash
pg_dump -U stock_admin -d stockmaster > backup.sql
```

### Restore Database
```bash
psql -U stock_admin -d stockmaster < backup.sql
```

### Automated Backup Script
```bash
# Run from backend directory
npm run db:backup
```

---

## Production Deployment Notes

For production, update `.env`:

```env
DATABASE_URL="postgresql://user:password@prod-host.com:5432/stockmaster?schema=public"
NODE_ENV=production
JWT_SECRET=generate-very-long-random-string-here
CORS_ORIGIN=https://yourdomain.com
```

**Important**:
- Never commit `.env` to version control
- Use environment variables on production server
- Enable SSL/TLS for database connections
- Use strong passwords
- Regular backups!

---

## API Database Operations

All database operations go through Prisma ORM:

```typescript
// Create
await prisma.product.create({
  data: { sku: 'SKU-001', name: 'Product Name' }
})

// Read
await prisma.product.findUnique({ where: { id: '1' } })

// Update
await prisma.product.update({
  where: { id: '1' },
  data: { name: 'New Name' }
})

// Delete
await prisma.product.delete({ where: { id: '1' } })
```

---

**Database Setup Complete** ✅
