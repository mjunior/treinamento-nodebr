const assert = require('assert')
const api = require('./../api')

const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')
const USER = {
  username: 'xuxudasilva',
  password: 'SenhaForte@123321'
}

const USER_DB = {
  ...USER,
  password: '$2b$04$OXdjJGe8z1s8fxa.0NfNouFOoswgn1bBJ9iQ8k5axud/vWlOvC3wa'
}

let app = {}
describe('Suite de teste auth', function () {
  this.beforeAll(async () => {
    app = await api
    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))
    const result = await contextPostgres.update(null, USER_DB, true)
  })

  it('deve obter um token', async() => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload);
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10)
  })

  it('nao pode obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {...USER, password: '111111'}
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload);
    assert.deepEqual(statusCode, 401);
  })
})