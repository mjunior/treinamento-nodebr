const assert = require('assert')
const api = require('./../api')
// const MongoDb = require('./../db/strategies/mongodb/mongodb')
// const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
// const Context = require('./../db/strategies/base/contextStrategy')

let app = {}
describe('Suite de teste auth', function () {
  this.beforeAll(async () => {
    app = await api
  })

  it('deve obter um token', async() => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload:{
        username: 'xuxudasilva',
        password: '123'
      }
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload);
    
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10)
  })
})