const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')
const api = require('./../api')

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flexas'
}

let app = {}
describe('Suite de teste API HEroes', function() {
  this.beforeAll(async() =>{
    app = await api
    const connection = MongoDb.connect()
    context = new Context(new MongoDb(connection, HeroiSchema))
    for(let i = 0;i<20;i++){
      await context.create({
        ...MOCK_HEROI_CADASTRAR,
        nome: `Heroi numero ${i}`
      });
    }
  })

  it('Listar /herois', async () =>{
    const result = await app.inject({
      method: 'GET',
      url: '/herois'
    })

    const dados = JSON.parse(result.payload)

    const statusCode =  result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(dados))
  })

  it('Listar /herois deve retornar apenas 10 registros', async () => {
    const limit = 3
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${limit}`
    })

    const dados = JSON.parse(result.payload)

    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
  })


  // it.only('Listar /herois deve retornar error 500', async () => {
  //   const limit = 'AAA'
  //   const result = await app.inject({
  //     method: 'GET',
  //     url: `/herois?skip=0&limit=${limit}`
  //   })

  //   const statusCode = result.statusCode
  //   assert.deepEqual(statusCode, 500)
  // })

  it('Listar /herois deve filtrar um item', async () => {
    const limit = 1
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${limit}&nome=Heroi+numero+1`
    })

    const [dados] = JSON.parse(result.payload)
    assert.deepEqual(dados.nome, 'Heroi numero 1')
  })
})