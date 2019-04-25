const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')
const api = require('./../api')

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flexas'
}

const MOCK_HEROI_CADASTRAR_DOIS = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta'
}

let MOCK_UPDATE = {}

let app = {}
describe.only('Suite de teste API HEroes', function() {
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

    [MOCK_UPDATE] = await context.read()

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


  it('Listar /herois deve retornar error 500', async () => {
    const limit = 'AAA'
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${limit}`
    })

    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 400)
  })

  it('Listar /herois deve filtrar um item', async () => {
    const limit = 1
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${limit}&nome=Heroi+numero+1`
    })

    const [dados] = JSON.parse(result.payload)
    assert.deepEqual(dados.nome, 'Heroi numero 1')
  })


  it('Cadastrar POST /herois', async () => {
    const limit = 1
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: MOCK_HEROI_CADASTRAR_DOIS
    })
    
    const { message, _id } = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 200)
    assert.notStrictEqual(_id, undefined)
    assert.deepEqual(message, "Heroi cadastrado com sucesso")
  })

  it('Cadastrar PATCH /herois/:id', async () => {
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${MOCK_UPDATE._id}`,
      payload: {
        poder: `Meu novo poder -> ${Date.now()}`
      }
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso');
  })

  it.only('Cadastrar PATCH /herois/:id Nao encontrado', async () => {
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/5cc122b00000000000000000`,
      payload: {
        poder: `Meu novo poder -> ${Date.now()}`
      }
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Não foi possivel atualizar');
  })
})