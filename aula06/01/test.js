const{
  deepEqual,
  ok
} = require('assert')
const database = require('./database.js')

const DEFAULT_ITEM_CADASTRAR = {
  nome: 'Flash',
  poder: 'Speed',
  id: 1
}

const DEFAULT_ITEM_ATUALIZAR = {
  nome: 'Lanterna Verde',
  poder: 'Energia do anel',
  id: 2
}

describe('Suite de manipulação de Heroius', () => {
  before(async () => {
    await database.escreverArquivo([])
  })
  
  it('Deve cadastrar um heroi, usando arquivos', async () =>{
    const expected = DEFAULT_ITEM_CADASTRAR
    const resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
    const [actual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id)
    deepEqual(actual, expected)
  })

  it('Deve pesquisar um heroi', async () =>{
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
    const expected = DEFAULT_ITEM_CADASTRAR
    const [resultado] = await database.listar(1)
    deepEqual(resultado, expected)
  })

  it('Deve remover um heroi por ID', async() =>{
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
    const expected = true;
    const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id);
    deepEqual(resultado, expected)
  })

  it('Deve atualizar heroi pelo id', async() => {
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
    
    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      nome: 'Batman',
      poder: 'Dinheiro'
    }

    const novoDado = {
      nome: 'Batman',
      poder: 'Dinheiro'
    }
    
    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)
    const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)

    deepEqual(resultado, expected)
  })
})