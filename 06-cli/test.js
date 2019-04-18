const {
  deepEqual,
  ok
} = require('assert')

const DEFAULT_ITEM_CADASTRAR = {
  nome: 'Flash',
  poder: 'Speed',
  id: 1
}

describe('Suite de manipulação de Herois', () => {
 
  it('Deve cadastrar umherou, usando arquivos', async () => {
    
    const expected = DEFAULT_ITEM_CADASTRAR
    ok(null, expected)

  })

})