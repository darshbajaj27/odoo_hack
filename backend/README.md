# StockMaster Backend

A comprehensive inventory management system API built with Node.js, Express, and Prisma ORM.

## Features

- 🔐 **Authentication** - JWT-based user authentication with role-based access control
- 📊 **Dashboard** - Real-time KPIs, charts, and analytics
- 📦 **Product Management** - Complete CRUD operations for products and categories
- 🚚 **Operations** - Track stock movements, transfers, and warehouse operations
- 🔍 **Search** - Global search across products and operations
- ⚙️ **Settings** - Warehouse, location, and user management
- 📱 **Move History** - Flattened view of all stock movements

## Prerequisites

- Node.js >= 16.x
- npm or yarn
- PostgreSQL 12+
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Project Structure

```
backend/
├── controllers/        # Business logic for each feature
├── routes/            # API route definitions
├── middleware/        # Express middleware (auth, validation, error handling)
├── config/            # Configuration files (database, JWT, CORS)
├── utils/             # Utility functions (logger, helpers)
├── validators/        # Request validation schemas
├── prisma/            # Database schema and migrations
├── tests/             # Unit and integration tests
├── scripts/           # Database and utility scripts
├── docs/              # API and project documentation
└── server.js          # Express application entry point
```

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server

### Database
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run pending migrations
- `npm run prisma:reset` - Reset database (dev only)
- `npm run prisma:seed` - Seed initial data
- `npm run db:backup` - Backup database
- `npm run db:restore` - Restore database from backup

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh` - Refresh JWT token

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data
- `GET /api/dashboard/recent-activity` - Get recent activity

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Operations
- `GET /api/operations` - List all operations
- `GET /api/operations/:id` - Get operation details
- `POST /api/operations` - Create new operation
- `PUT /api/operations/:id` - Update operation
- `PATCH /api/operations/:id/status` - Update operation status
- `DELETE /api/operations/:id` - Delete operation

### Moves
- `GET /api/moves` - Get move history with filters

### Search
- `GET /api/search?q=query` - Global search

### Settings
- `GET /api/settings/warehouses` - List warehouses
- `GET /api/settings/locations` - List locations
- `GET /api/settings/users` - List users
- `GET /api/settings/contacts` - List contacts

## Environment Variables

See `.env.example` for all available variables. Key variables:

- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed CORS origins
- `NODE_ENV` - Environment (development/production)

## Testing

Run the test suite:

```bash
npm test
```

For specific test files:
```bash
npm test -- auth.test.js
```

With coverage:
```bash
npm run test:coverage
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

## Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Testing Guide](./docs/TESTING.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.
