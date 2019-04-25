const BaseRoute = require('./base/baseRoute')
const Boom = require('boom')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')

const failAction = (request, headers, error) => {
  throw error
}

const USER = 'xuxudasilva'
const PWD = '123'

class AuthRoutes extends BaseRoute {
  constructor(secret) {
    super()
    this.secret = secret
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

        console.log('username', username);
        if(username.toLowerCase() !== USER || password !== PWD){
          return Boom.unauthorized()
        }
        const token = Jwt.sign({
          username: username,
          id: 1
        }, this.secret)

        return { token }
      }
    }
  }

}

module.exports = AuthRoutes