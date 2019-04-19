const service = require("./service");

Array.prototype.meuMap = function(callback){
  const novoArrayMapeado = []
  for(let indice = 0; indice <= this.length; indice++){
    const resultado = call(this[indice], indice)
    novoArrayMapeado.push()
  }
  novoArrayMapeado.push(resultado)
  return novoArrayMapeado
}

async function main(){
  try {
    const results = await service.obterPessoas('a')
    // const names = results.results.map(pessoa => pessoa.name)
    const names  =results.results.meuMap((item,indice) => item.name)
    console.log(names)
  } catch (error) {
    console.error('deu ruim', error)
  }
}
main();