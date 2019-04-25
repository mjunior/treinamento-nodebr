const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')
const api = require('./../api')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eHVkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU1NjE3NzY4OH0.gfb79nhcl0Q2NgDfCBXD46JGCCH3jZT2MtYiB9sdDH8'

const headers = {
  Authorization: token
}
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

    [MOCK_UPDATE] = await context.read()

  })

  it('Listar /herois', async () =>{
    const result = await app.inject({
      method: 'GET',
      headers,
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
      headers,
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
      headers,
      url: `/herois?skip=0&limit=${limit}`
    })

    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 400)
  })

  it('Listar /herois deve filtrar um item', async () => {
    const limit = 1
    const result = await app.inject({
      method: 'GET',
      headers,
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
      headers,
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
      headers,
      payload: {
        poder: `Meu novo poder -> ${Date.now()}`
      }
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso');
  })

  it('Cadastrar PATCH /herois/:id Nao encontrado', async () => {
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/5cc122b00000000000000000`,
      headers,
      payload: {
        poder: `Meu novo poder -> ${Date.now()}`
      }
    })
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(dados, {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Não foi possivel atualizar'
    });
  })

  it('Cadastrar DELETE /herois/:id encontrado', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${MOCK_UPDATE._id}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Heroi removido com sucesso');
  })

  it('Cadastrar DELETE /herois/:id Nao encontrado', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/5cc122b00000000000000000`,
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.ok(statusCode === 412)
    assert.deepEqual(dados, {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Não foi possivel excluir'
    });
  })
})