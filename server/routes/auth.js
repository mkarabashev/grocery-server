const Router = require('express').Router;
const { login, register } = require('../controllers/auth');

module.exports = function authRoutes(app) {
  const routes = Router();
  routes.post('/register', register);
  routes.post('/login', login);
  app.use('/api/auth', routes);
};
