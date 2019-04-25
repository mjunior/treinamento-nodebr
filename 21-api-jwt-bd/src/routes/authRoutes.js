const BaseRoute = require('./base/baseRoute')
const Boom = require('boom')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')
const failAction = (request, headers, error) => {
  throw error
}

const USER = 'xuxudasilva'
const PWD = '123'

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this.db = db
  }

  login(){
    return {
      path: '/login',
      method: 'POST',
      config:{
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'Gera token por usuario e senha',
        validate:{
          failAction,
          payload: {
            username: Joi.string().required().min(3),
            password: Joi.string().required().min(3)
          }
        }
      },
      handler: async (request) =>{
        const {username, password} = request.payload
        
        const [usuario] = await this.db.read({
          username: username.toLowerCase()
        })

        if(!usuario){
          return Boom.unauthorized('Usuario infomrado não existe')
        }
        
        const match = await PasswordHelper.compare(password, usuario.password)

        if(!match){
          return Boom.unauthorized('Usuário ou senha inválido')
        }

        const token = Jwt.sign({
          username: username,
          id: usuario.id
        }, this.secret)

        return { token }
      }
    }
  }

}

module.exports = AuthRoutes