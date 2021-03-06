const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoutes = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRoutes')
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert')
const JWT_SECRET = '98yguvbihimu09'
const HapiJwt = require('hapi-auth-jwt2');

const app = new Hapi.Server({
  port: 5000
})

function mapRoutes(instance, methods){
  return methods.map(method => instance[method]())
}

async function main(){
  const connection = MongoDb.connect();
  const context  = new Context(new MongoDb(connection, HeroiSchema))
  const swaggerOpts = {
    info:{
      title: 'API Herois - Curso NODEBR',
      version: 'v1.0' 
    },
    lang: 'pt'
  }
  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      option: swaggerOpts
    }
  ])
  
  app.auth.strategy('jwt','jwt',{
    key: JWT_SECRET,
    // options:{
    //   expiredIn: 20
    // },
    validate: (dado, request) =>{
      //veririca se user esta ativo
      //se user efeutou pgto
      return {
        isValid: true //caso nao, false
      }
    }
  })

  app.auth.default('jwt');
  
  app.route([
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())]
  )

  await app.start();
  return app
}

module.exports = main()
