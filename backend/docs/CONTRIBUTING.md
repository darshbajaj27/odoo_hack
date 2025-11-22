# Contributing Guidelines

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Follow the style guide**
5. **Test your changes**
6. **Create a pull request**

## Development Workflow

### Setup Development Environment

```bash
git clone <your-fork>
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Code Style

- **Language**: JavaScript (Node.js)
- **Formatter**: Prettier
- **Linter**: ESLint
- **Naming**: camelCase for variables/functions, PascalCase for classes

### Format Code

```bash
npm run format
npm run lint:fix
```

### Running Tests

```bash
npm test
npm run test:coverage
```

## Commit Guidelines

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build, dependencies, etc.

### Examples

```
feat(products): add product search by SKU

Implement full-text search for products by SKU code
in the product listing endpoint.

Fixes #123
```

```
fix(operations): correct quantity calculation

Fixed issue where operation quantity was being
incorrectly calculated for transfer operations.
```

## Pull Request Process

1. **Update CHANGELOG.md**
2. **Ensure all tests pass**
3. **Update documentation**
4. **Request review from maintainers**
5. **Address review feedback**
6. **Squash commits if necessary**
7. **Merge when approved**

### PR Title Format

```
[TYPE] Brief description

- Change 1
- Change 2
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Related Issues
Fixes #123

## Screenshots (if applicable)
```

## File Structure Guidelines

### Controllers

- One controller per feature
- Methods correspond to HTTP operations
- Error handling with try-catch
- Logging for important operations

### Routes

- Clear RESTful endpoint structure
- Middleware applied appropriately
- Comments for complex routes

### Middleware

- Single responsibility
- Reusable across routes
- Proper error handling

### Utils and Helpers

- Focused, single-purpose functions
- Well-documented
- Thoroughly tested

### Tests

- Test files in `tests/` directory
- Clear, descriptive test names
- Comprehensive coverage
- Both unit and integration tests

## Documentation

All changes must include documentation:

1. **Code comments** for complex logic
2. **JSDoc** for functions
3. **README** updates for new features
4. **API.md** for new endpoints
5. **Database.md** for schema changes

### JSDoc Example

```javascript
/**
 * Create a new product
 * @param {Object} productData - Product information
 * @param {string} productData.name - Product name
 * @param {number} productData.price - Product price
 * @returns {Promise<Object>} Created product
 * @throws {Error} If validation fails
 */
async function createProduct(productData) {
  // Implementation
}
```

## Performance Considerations

- Minimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Avoid nested loops
- Monitor response times

## Security Guidelines

- Validate all inputs
- Use parameterized queries
- Hash sensitive data
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated

## Database Changes

- Create migration files
- Update schema.prisma
- Update DATABASE.md
- Test migration rollback
- Document breaking changes

## Deployment

- Test changes locally
- Verify database migrations
- Check environment variables
- Update CHANGELOG
- Tag release
- Deploy to staging first
- Monitor logs after deployment

## Review Checklist

- [ ] Code follows style guide
- [ ] All tests passing
- [ ] No console logs left
- [ ] Documentation updated
- [ ] No sensitive data exposed
- [ ] Performance acceptable
- [ ] Security concerns addressed

## Getting Help

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree to license your contributions under the MIT License.
