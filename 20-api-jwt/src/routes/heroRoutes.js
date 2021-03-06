const BaseRoute = require('./base/baseRoute')
const Boom = require('boom')
const Joi = require('joi')
const failAction = (request, headers, error) => {
  throw error
}

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown()

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
        tags:['api'],
        description: 'Lista todos os herois cadastrados',
        notes: 'Pode paginar os resultados e filtrar por nome',
        validate: {
          failAction,
          query:{
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          },
          headers: headers
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
          return Boom.internal()
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Cadastrar Heroi',
        notes: 'Cadastra com nome e poder',
        validate:{
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100)
          },
          headers: headers
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
          return Boom.internal()
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Atualiza um heroi por ID',
        notes: 'Atualiza poder e nome de um heroi por ID',
        validate: {
          failAction,
          params:{
            id: Joi.string().required()
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          },
          headers: headers
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
            return Boom.preconditionFailed('Não foi possivel atualizar')
          }
          return { message: 'Heroi atualizado com sucesso', _id: result._id }
        } catch (error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deleta heroi por ID',
        notes: 'Deleta um heroi do ID informado',
        validate: {
          failAction,
          params: {
            id: Joi.string().required()
          },
          headers: headers
        }
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params
          const result = await this.db.delete(id)
          if (result.deletedCount !== 1) {
            return Boom.preconditionFailed('Não foi possivel excluir')
          }
          return { message: 'Heroi removido com sucesso' }
        } catch (error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }
}

module.exports = HeroRoutes