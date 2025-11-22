# Database Schema Documentation

## Overview

The StockMaster backend uses PostgreSQL with Prisma ORM. This document describes all tables and their relationships.

## Tables

### Users

Stores user account information.

```
id          String    Primary Key (CUID)
email       String    Unique
password    String    Hashed password
firstName   String
lastName    String
phone       String?   Optional
role        String    ADMIN, MANAGER, USER
isActive    Boolean   Default: true
createdAt   DateTime  Auto-set
updatedAt   DateTime  Auto-update
```

**Relationships:**
- `operations`: One-to-many with Operations

---

### Products

Stores product information.

```
id              String    Primary Key (CUID)
name            String
sku             String    Unique
description     String?   Optional
category        String
price           Float
quantity        Int       Default: 0
reorderLevel    Int       Default: 10
isActive        Boolean   Default: true
createdAt       DateTime  Auto-set
updatedAt       DateTime  Auto-update
```

**Relationships:**
- `operations`: One-to-many with Operations
- `locations`: Many-to-many with Locations

**Indexes:**
- category
- sku

---

### Warehouses

Stores warehouse location information.

```
id        String    Primary Key (CUID)
name      String
code      String    Unique
address   String
city      String
state     String
zipCode   String
country   String
isActive  Boolean   Default: true
createdAt DateTime  Auto-set
updatedAt DateTime  Auto-update
```

**Relationships:**
- `locations`: One-to-many with Locations

---

### Locations

Stores specific storage locations within warehouses (Aisles, Racks, Shelves).

```
id          String    Primary Key (CUID)
name        String
code        String    Unique
warehouseId String    Foreign Key
aisle       String?   Optional
rack        String?   Optional
shelf       String?   Optional
isActive    Boolean   Default: true
createdAt   DateTime  Auto-set
updatedAt   DateTime  Auto-update
```

**Relationships:**
- `warehouse`: Many-to-one with Warehouses
- `products`: Many-to-many with Products
- `fromOperations`: One-to-many with Operations (as source)
- `toOperations`: One-to-many with Operations (as destination)

**Indexes:**
- warehouseId
- code

---

### Operations

Tracks all stock movements (Inbound, Outbound, Transfers, Adjustments).

```
id             String    Primary Key (CUID)
productId      String    Foreign Key
quantity       Int
type           String    INBOUND, OUTBOUND, TRANSFER, ADJUSTMENT
status         String    PENDING, COMPLETED, CANCELLED
fromLocationId String?   Foreign Key (nullable)
toLocationId   String?   Foreign Key (nullable)
notes          String?   Optional
userId         String    Foreign Key
createdAt      DateTime  Auto-set
updatedAt      DateTime  Auto-update
```

**Relationships:**
- `product`: Many-to-one with Products
- `fromLocation`: Many-to-one with Locations (nullable)
- `toLocation`: Many-to-one with Locations (nullable)
- `user`: Many-to-one with Users

**Indexes:**
- productId
- status
- type
- createdAt

---

### Contacts

Stores supplier, customer, and logistics partner information.

```
id        String    Primary Key (CUID)
name      String
email     String?   Unique (nullable)
phone     String?   Optional
company   String?   Optional
type      String    SUPPLIER, CUSTOMER, LOGISTICS
isActive  Boolean   Default: true
createdAt DateTime  Auto-set
updatedAt DateTime  Auto-update
```

**Indexes:**
- type

---

## Relationships Summary

```
User (1) ---> (Many) Operation
Product (1) ---> (Many) Operation
Warehouse (1) ---> (Many) Location
Location (1) ---> (Many) Operation (as fromLocation)
Location (1) ---> (Many) Operation (as toLocation)
Location (Many) <---> (Many) Product
```

## Migration

Migrations are stored in `prisma/migrations/` and are automatically generated when you run:

```bash
npx prisma migrate dev
```

## Seeding

To seed the database with initial data:

```bash
npx prisma db seed
```

See `prisma/seed.js` for seed script.

## Data Constraints

### User
- Email must be unique and valid
- Password is required and hashed
- Role defaults to USER

### Product
- SKU must be unique
- Price and Quantity must be non-negative
- Category is required

### Operation
- Type must be one of: INBOUND, OUTBOUND, TRANSFER, ADJUSTMENT
- Status must be one of: PENDING, COMPLETED, CANCELLED
- For TRANSFER type, both fromLocationId and toLocationId must be provided

### Location
- Code must be unique
- Must belong to a warehouse

## Performance Considerations

1. **Indexes**: Created on frequently queried fields (SKU, category, status, type, dates)
2. **Pagination**: All list endpoints should implement pagination
3. **Relationships**: Use selective loading to avoid N+1 queries
4. **Archiving**: Consider soft deletes for historical data
5. **Caching**: Consider caching product and warehouse data

## Backup and Recovery

Regular backups should be taken:

```bash
npm run db:backup
npm run db:restore <backup-file>
```
