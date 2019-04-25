const assert = require('assert');
const Postgres = require('./../db/strategies/postgres/postgres')
const Context = require('./../db/strategies/base/contextStrategy')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema')
let context = {}
const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flexas'
}
const MOCK_HEROI_ATUALIZAR = {
  nome: 'Batman',
  poder: 'Dinheiro'
}

describe('Postgres strategy', function(){
  this.timeout(Infinity)

  this.beforeAll(async () => {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema)
    
    context = new Context(new Postgres(connection, model));
  
    await context.delete()
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

  it('Listar', async () => {
    await context.create(MOCK_HEROI_CADASTRAR)
    const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })

  it('Atualizar', async () => {
    await context.create(MOCK_HEROI_ATUALIZAR)
    const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Mulher Maravilha'
    }

    const [result] = await context.update(itemAtualizar.id, novoItem)
    const [itemAtualizado] = await context.read({id: itemAtualizar.id})
    assert.deepEqual(itemAtualizado.nome, 'Mulher Maravilha')
    assert.deepEqual(result, 1)
  })

  it('Remover por id', async () => {
    const cadastrar = await context.create(MOCK_HEROI_CADASTRAR)
    const [itemDeletar] = await context.read()
    const result = await context.delete(itemDeletar.id)
    assert.deepEqual(result, 1)
  })
  
})