const request = require('supertest');

const requestHelper = {
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

    return response.body.accessToken;
  },
};

module.exports = requestHelper;
