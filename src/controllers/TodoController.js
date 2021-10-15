const Todo = require('../models/TodoModel');

module.exports = {
    async index(req, res) {
        const todos = await Todo.get(req.session.user)
        res.render('todo', { todos })
    },
    async create(req, res) {
        try {
            const errors = await Todo.create({
                email: req.body.email,
                todo: req.body.todo
            })

            if(errors.length > 0) {
                req.flash('errors', errors)
                return req.session.save(() => res.redirect('back'))
            }

        } catch(e) {
            console.log(e)
        }
        res.redirect('back')
    },
    async update(req, res) {
        try {
            if(!req.params.id) return res.redirect('back')
            const todo = await Todo.update(req.params.id, req.body)
            if(!todo) return res.json({ errors: "Todo não foi encontrada"})
            
            res.json(req.body)
        } catch(e) {
            console.log(e)
            res.json({ errors: "Ocorreu um erro"})
        }
    },
    async delete(req, res) {
        if(!req.params.id) return res.redirect('back')

        const todo = await Todo.delete(req.params.id)

        res.redirect('back')
    }
}