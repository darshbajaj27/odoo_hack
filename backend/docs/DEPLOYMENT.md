# Deployment Guide

## Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn
- Git
- Docker (optional)

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Dependencies updated and audited
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] SSL certificates ready

## Environment Setup

### Production Environment Variables

Create `.env.production`:

```
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/stockmaster_prod

# JWT
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Security Best Practices

1. **JWT Secret**: Generate a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Database Password**: Use strong passwords
3. **CORS**: Set specific origins, not wildcard
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Use secure vaults

## Database Migration

### Pre-Deployment

1. **Backup existing database**
   ```bash
   npm run db:backup
   ```

2. **Test migrations locally**
   ```bash
   npm run prisma:migrate
   ```

3. **Review migration SQL**
   ```bash
   cat prisma/migrations/<timestamp>_<name>/migration.sql
   ```

### Deployment

1. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

2. **Verify migration success**
   ```sql
   SELECT * FROM _prisma_migrations;
   ```

## Deployment Methods

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t stockmaster-backend:latest .
   ```

2. **Run container**
   ```bash
   docker run -p 5000:5000 \
     --env-file .env.production \
     stockmaster-backend:latest
   ```

### Traditional Server Deployment

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install --production
   ```

3. **Build application**
   ```bash
   npm run build
   ```

4. **Start service**
   ```bash
   npm start
   ```

### Using PM2 (Process Manager)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'stockmaster-api',
         script: './server.js',
         instances: 4,
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production',
           PORT: 5000,
         },
       },
     ],
   };
   ```

3. **Start application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

### Heroku Deployment

1. **Create Procfile**
   ```
   web: npm start
   release: npx prisma migrate deploy
   ```

2. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=<secret>
   heroku config:set DATABASE_URL=<postgresql-url>
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### AWS Elastic Beanstalk

1. **Create .ebextensions/nodecommand.config**
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
   ```

2. **Deploy**
   ```bash
   eb deploy
   ```

## Post-Deployment

### Health Checks

```bash
curl http://your-api.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Verification Tests

```bash
npm run test
```

### Monitor Logs

```bash
# PM2
pm2 logs stockmaster-api

# Docker
docker logs <container-id>

# System logs
tail -f /var/log/stockmaster-api.log
```

## Performance Optimization

1. **Enable HTTP/2 and compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Implement caching headers**
   ```javascript
   app.use((req, res, next) => {
     res.set('Cache-Control', 'public, max-age=300');
     next();
   });
   ```

3. **Database connection pooling**
   ```javascript
   // Configured in .env
   DATABASE_URL=postgresql://...?schema=public
   ```

4. **Rate limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
   });
   app.use('/api/', limiter);
   ```

## Monitoring and Logging

### Application Monitoring

Use services like:
- **New Relic**
- **Datadog**
- **CloudWatch**
- **ELK Stack**

### Logging

Configure centralized logging:
```javascript
// logs/all.log
// logs/error.log
```

### Alerts

Set up alerts for:
- High error rates
- Slow response times
- Database connection issues
- Memory usage
- Disk space

## Rollback Procedure

If deployment fails:

1. **Revert code**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Rollback database**
   ```bash
   npm run db:restore <backup-file>
   ```

3. **Restart application**
   ```bash
   pm2 restart stockmaster-api
   ```

## SSL/TLS Configuration

1. **Obtain certificate** (Let's Encrypt recommended)
2. **Configure in nginx/Apache**
3. **Set secure headers**
   ```javascript
   app.use((req, res, next) => {
     res.setHeader('Strict-Transport-Security', 'max-age=31536000');
     next();
   });
   ```

## Backup and Recovery

### Automated Backups

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backend/scripts/backup-db.sh
```

### Manual Backup

```bash
npm run db:backup
```

### Restore from Backup

```bash
npm run db:restore backups/backup_20240115_020000.sql
```

## Troubleshooting

### High Memory Usage
- Check for memory leaks
- Increase available memory
- Restart application

### Database Connection Timeouts
- Check connection pool size
- Verify network connectivity
- Check database load

### Slow Response Times
- Enable query logging
- Add database indexes
- Implement caching

## Support

For deployment issues:
1. Check logs
2. Review error messages
3. Verify configuration
4. Contact support team
