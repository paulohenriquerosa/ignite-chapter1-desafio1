const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const {username} = request.headers

  const user = users.find(user => user.username === username)

  if(!user){
    return response.status(404).json({error: 'Usuário não encontrado'})
  }
  request.user = user
  next()

}

app.post('/users', (request, response) => {
  
  const {name, username} = request.body

  const user = users.find(user => user.username === username)

  if(user){
    return response.status(400).json({error: 'Usuário já existente!'})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const {user} = request
  return response.status(201).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const {user} = request
  const { title, deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {id} = request.params
  const {user} = request
  const {title, deadline} = request.body

  const todoIndex = user.todos.findIndex(todo => todo.id === id)


  if(todoIndex < 0){
    return response.status(404).json({error: 'Not found'})
  }

  user.todos[todoIndex] = {
    ...user.todos[todoIndex],
    title,
    deadline
  }

  return response.status(200).json(user.todos[todoIndex])

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {user} = request
  const {id} = request.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if(todoIndex < 0){
    return response.status(404).json({error: 'Not found'})
  }

  user.todos[todoIndex].done = true

  return response.status(200).json(user.todos[todoIndex])

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {user} = request
  const {id} = request.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if(todoIndex < 0){
    return response.status(404).json({error: 'Not found'})
  }

   user.todos.splice(user.todos[todoIndex],1)

  return response.status(204).send()
});

module.exports = app;
