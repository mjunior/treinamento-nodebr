const BaseRoute = require('./base/baseRoute')
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query
          
          let query ={}
          if(nome){
            query.nome= nome;
          }

          if (skip && isNaN(skip)){
            throw Error('Tipo incorreto')
          }

          if (limit && isNaN(limit)){
            throw Error('Tipo incorreto')
          }

          return this.db.read(query, parseInt(skip), parseInt(limit))

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
      handler: (request, headers) => {
        return 'CREATE'
      }
    }
  }
}

module.exports = HeroRoutes