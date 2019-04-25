const assert = require('assert')
const PasswordHelper =  require('./../helpers/passwordHelper')
const SENHA = 'SenhaForte@123321'
const HASH = '$2b$04$OXdjJGe8z1s8fxa.0NfNouFOoswgn1bBJ9iQ8k5axud/vWlOvC3wa'

describe('User helper test suite', function(){
  it('Deve gerar hash a partir de uma senha', async()=>{
    const result = await PasswordHelper.hashPassword(SENHA)
    assert.ok(result.length > 10)    
  })

  it('Deve validar a senha a partir de um hash', async () => {
    const result = await PasswordHelper.compare(SENHA, HASH)
    assert.ok(result)
  })


  it('Deve recusar a senha invalidade um hash', async () => {
    const result = await PasswordHelper.compare(SENHA, HASH+"123")
    assert.ok(!result)
  })
})