const ICrud = require('./interfaces/interfaceICrud')

class MongoDB extends ICrud{
  constructor(){
    super()
  }

  create(item){
    console.log('Criando item no MongoDB')
  }
}
module.exports = MongoDB