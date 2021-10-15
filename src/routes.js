const express = require('express');
const route = express.Router();

const loginController = require("./controllers/LoginController")
const todoController = require("./controllers/TodoController")

const { loginRequired } = require('./middlewares/middleware')

// Login and signup routes
route.get('/', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

// Todo routes
route.get('/todo', loginRequired, todoController.index)
route.post('/todo/create', loginRequired, todoController.create)
route.post('/todo/update/:id', loginRequired, todoController.update)
route.get('/todo/delete/:id', loginRequired, todoController.delete)

module.exports = route