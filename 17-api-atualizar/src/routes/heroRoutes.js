const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const failAction = (request, headers, error) => {
  throw error
}
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        validate: {
          failAction,
          query:{
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          }
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query
          const query = { 
            // nome: { $regex: `.*${nome}*.`}
            nome: nome
          }
          return this.db.read(nome ? query : {}, skip, limit)

        } catch (error) {
          console.log('DEU RUIM', error)
          return "ERROR 500"
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        validate:{
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100)
          }
        }
      },
      handler: async (request, headers) => {
        try {
          const { nome, poder } = request.payload
          const result = await this.db.create({
            nome,
            poder
          })
          return { message: 'Heroi cadastrado com sucesso', _id: result._id }
        } catch (error) {
          console.log('DEU RUIM', error)
          return 'ERRO 500'
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        validate: {
          failAction,
          params:{
            id: Joi.string().required()
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          }
        }
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params
          const { payload } = request
          
          const dadosString = JSON.stringify(payload)
          const dados = JSON.parse(dadosString)

          const result = await this.db.update(id, dados)
          if(result.nModified !== 1){
            return { message: 'Não foi possivel atualizar' }
          }
          return { message: 'Heroi atualizado com sucesso', _id: result._id }
        } catch (error) {
          console.log('DEU RUIM', error)
          return 'ERRO 500'
        }
      }
    }
  }
}

module.exports = HeroRoutes