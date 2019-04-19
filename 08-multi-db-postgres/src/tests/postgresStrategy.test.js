const assert = require('assert');
const Postgres = require('./../db/strategies/postgres')
const Context = require('./../db/strategies/base/contextStrategy')

context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flexas'
}

describe('Postgres strategy', function(){
  this.timeout(Infinity)

  this.beforeAll(async () => {
    db = await context.connect();
  })

  it('Postgres sql connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, true)
  })

  it('Cadastrar', async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR)
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })
  

})