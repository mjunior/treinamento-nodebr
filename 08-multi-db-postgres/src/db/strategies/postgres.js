
const ICrud = require('./interfaces/interfaceICrud')
class PostgresDB extends ICrud{
  constructor(){
    super()
  }

  create(item){
    console.log('Criando item no POSTGRES')
  }
}

module.exports = PostgresDB