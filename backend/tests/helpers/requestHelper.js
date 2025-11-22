// ============================================
// backend/tests/helpers/requestHelper.js (COMPLETE)
// ============================================
const request = require('supertest');
const jwt = require('jsonwebtoken');

const requestHelper = {
  /**
   * Generate JWT token for testing
   */
  generateToken(userId, email, role = 'USER') {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '7d' }
    );
  },

  /**
   * Generate refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '30d' }
    );
  },

  /**
   * Helper to make authenticated requests
   */
  async authenticatedRequest(app, method, path, token, body = null) {
    let req = request(app)[method.toLowerCase()](path)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    if (body) {
      req = req.send(body);
    }

    return req;
  },

  /**
   * Login user and get token
   */
  async loginUser(app, email, password) {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    if (response.status === 200) {
      return response.body.accessToken;
    }
    
    throw new Error(`Login failed: ${response.body.error || 'Unknown error'}`);
  },

  /**
   * Register a new user and get token
   */
  async registerUser(app, userData) {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    if (response.status === 201) {
      return {
        user: response.body.user,
        accessToken: response.body.accessToken,
        refreshToken: response.body.refreshToken,
      };
    }
    
    throw new Error(`Signup failed: ${response.body.error || 'Unknown error'}`);
  },

  /**
   * Make authenticated GET request
   */
  async authGet(app, path, token) {
    return this.authenticatedRequest(app, 'GET', path, token);
  },

  /**
   * Make authenticated POST request
   */
  async authPost(app, path, token, body) {
    return this.authenticatedRequest(app, 'POST', path, token, body);
  },

  /**
   * Make authenticated PUT request
   */
  async authPut(app, path, token, body) {
    return this.authenticatedRequest(app, 'PUT', path, token, body);
  },

  /**
   * Make authenticated PATCH request
   */
  async authPatch(app, path, token, body) {
    return this.authenticatedRequest(app, 'PATCH', path, token, body);
  },

  /**
   * Make authenticated DELETE request
   */
  async authDelete(app, path, token) {
    return this.authenticatedRequest(app, 'DELETE', path, token);
  },

  /**
   * Make public request (no auth)
   */
  async publicRequest(app, method, path, body = null) {
    let req = request(app)[method.toLowerCase()](path)
      .set('Content-Type', 'application/json');

    if (body) {
      req = req.send(body);
    }

    return req;
  },

  /**
   * Make public GET request
   */
  async publicGet(app, path) {
    return this.publicRequest(app, 'GET', path);
  },

  /**
   * Make public POST request
   */
  async publicPost(app, path, body) {
    return this.publicRequest(app, 'POST', path, body);
  },

  /**
   * Assert successful response
   */
  assertSuccess(response, expectedStatus = 200) {
    if (response.status !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus}, got ${response.status}: ${JSON.stringify(response.body)}`
      );
    }
  },

  /**
   * Assert error response
   */
  assertError(response, expectedStatus, errorMessage = null) {
    if (response.status !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus}, got ${response.status}: ${JSON.stringify(response.body)}`
      );
    }
    
    if (errorMessage && !response.body.error.includes(errorMessage)) {
      throw new Error(
        `Expected error message to include "${errorMessage}", got: ${response.body.error}`
      );
    }
  },

  /**
   * Assert response has property
   */
  assertHasProperty(response, property) {
    if (!response.body.hasOwnProperty(property)) {
      throw new Error(
        `Expected response to have property "${property}", got: ${JSON.stringify(response.body)}`
      );
    }
  },

  /**
   * Assert array response
   */
  assertArrayResponse(response, minLength = 0) {
    if (!Array.isArray(response.body)) {
      throw new Error('Expected response body to be an array');
    }
    if (response.body.length < minLength) {
      throw new Error(
        `Expected array length to be at least ${minLength}, got ${response.body.length}`
      );
    }
  },
};

module.exports = requestHelper;