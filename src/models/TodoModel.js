const mongoose = require("mongoose")
const validator = require("validator")

const TodoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  todo: { type: String, required: true },
  status: { type: String, default: "active" },
  created_at: { type: Date, default: Date.now },
})

const TodoModel = mongoose.model("Todo", TodoSchema)

module.exports = {
    async get(user) {
      const todos = await TodoModel.find({ "email": user.email})
      return todos
    },
    async create(todo) {
      for(const key in todo) {
        if(typeof todo[key] !== 'string') todo[key] = '' 
      }

      const errors = this.validate(todo)
      if(errors.length == 0) await TodoModel.create(todo) 
      
      return errors
    },
    validate(todo) {
      const errors = []
      if(todo.email && !validator.isEmail(todo.email)) errors.push("O email que está logado é inválido")
      if(!todo.todo) errors.push("O campo de tarefa é obrigatório")

      return errors
    },
    async update(id, todo) {
      if(typeof id !== 'string') return

      for(const key in todo) {
        if(typeof todo[key] !== 'string' || todo[key].length == 0) throw new Error("Invalid value") 
      }
      const updatedTodo = await TodoModel.findByIdAndUpdate(id, todo)
      return updatedTodo
    },
    async delete(id) {
      if(typeof id !== 'string') return
      const todo = await TodoModel.findOneAndDelete({_id: id})
      return todo
    }
}