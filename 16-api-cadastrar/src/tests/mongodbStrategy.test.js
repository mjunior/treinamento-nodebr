const assert = require('assert');
const MongoDb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')

let context = {}

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flexas'
}
const MOCK_HEROI_ATUALIZAR = {
  nome: 'Batman',
  poder: 'Dinheiro'
}

describe('MongoDB strategy', function(){

  this.beforeAll(async () => {
    const connection = MongoDb.connect()
    context = new Context(new MongoDb(connection,HeroiSchema))
  })
  
  it('MongoDB sql connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, 1)
  })

  it('Cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
  })

  it('Listar', async () => {
    await context.create(MOCK_HEROI_CADASTRAR);
    const [{nome,poder}] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome});
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
  })

  it('Atualizar', async () => {
    const itemAtualizar = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.update(itemAtualizar._id,{
      nome: 'Pernalonga'
    });
    assert.deepEqual(result.nModified, 1)
  })

  it('Atualizar', async () => {
    const itemDeletar = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.delete(itemDeletar._id);
    assert.deepEqual(result.n,1)
  })
  
})