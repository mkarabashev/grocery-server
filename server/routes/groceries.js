const Router = require('express').Router;

const {
  createList,
  deleteList,
  getList,
  changeListName,
  addItem,
  completeItem,
  removeItem,
  editItem
} = require('../controllers/groceries');

module.exports = function groceryRoutes(app) {
  const routes = Router();
  routes.post('/new', createList);
  routes.post('/add', addItem);

  routes.put('/complete', completeItem);
  routes.put('/listname', changeListName);
  routes.put('/edititem', editItem);

  routes.delete('/deletelist', deleteList);
  routes.delete('/removeitem', removeItem);

  routes.get('/list', getList);

  app.use('/api/groceries', routes);
};
