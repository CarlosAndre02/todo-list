const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

module.exports = {
  async register(register) {
    const errors = this.validate(register)
    if(errors.length > 0) return { errors }
    
    const isUserExists = await this.getUser(register.email)
    if(isUserExists) return { errors: 'Usuário já existe.' }

    const salt = bcryptjs.genSaltSync()
    register.password = bcryptjs.hashSync(register.password, salt)
    const user = await LoginModel.create(register)

    return {
      errors,
      user
    } 
  },
  async login(login) {
    const errors = this.validate(login)
    if(errors.length > 0) return { errors }
    
    const user = await this.getUser(login.email)
    if(!user) {
      errors.push('Usuário não existe.')
      return { errors }
    }

    if(!bcryptjs.compareSync(login.password, user.password))
      errors.push('Senha inválida')

    return {
      errors,
      user
    } 
  },
  validate(user) {
    const errors = []

    for(const key in user) {
      if(typeof user[key] !== 'string') {
        user[key] = ''
      }
    }

    if(!validator.isEmail(user.email)) errors.push('E-mail inválido')
    if(user.password.length < 3 || user.password.length > 50) {
      errors.push('A senha precisa ter entre 3 e 50 caracteres.')
    }

    return errors
  },
  async getUser(userEmail) {
    const user = await LoginModel.findOne({ email: userEmail })
    return user
  }
}