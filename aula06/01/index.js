const Commander = require('commander');
const database = require('./database');
const Heroi = require('./heroi')

async function main(params){
  Commander
    .version('v1')
    .option('-n, --nome [value]', "Nome do heroi")
    .option('-p, --poder [value]', "Poder do heroi")
    .option('-i, --id [value]', "ID heroi")

    .option('-c, --cadastrar', "Cadastrar umheroi")
    .option('-l, --listar', "Listar um heroi")
    .option('-r, --remover', "Remover um heroi pelo id")
    .option('-a, --atualizar [value]', "atualizar um heroi pelo id")

    .parse(process.argv)

    const heroi = new Heroi(Commander)

    try {
      if(Commander.cadastrar){
        delete heroi.id
        const resultado = await database.cadastrar(heroi)
        if(!resultado){
          console.error('Heroi não cadastrado', 'TUM');
          return;
        }
        console.log('Heroi cadastrado com sucesso!')
      }

      if(Commander.listar){
        const resultado =  await database.listar()
        console.log(resultado)
        return
      }

      if(Commander.remover){
        const resultado = await database.remover(heroi.id)
        if(resultado){
          console.log('Heroi removido com sucesso')
        }else{
          console.error('Não foi possivel remover heroi');
        }
        return;
      }

      if(Commander.atualizar){
        const idParaAtualizar = parseInt(Commander.atualizar);
        delete heroi.id

        const dado = JSON.stringify(heroi)
        const heroiAtualizar = JSON.parse(dado)

        const resultado = await database.atualizar(idParaAtualizar, heroiAtualizar)
        if(resultado){
          console.log('Heroi atualizado com sucesso')
        }else{
          console.error('Nao foi possivel atualizar heroi')
        }
        return;
      }
    } catch (error) {
      console.error('DEU RUIM', error)
    }
}
main();