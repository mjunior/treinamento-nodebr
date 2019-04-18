const { get } = require('axios')
const URL = `https://swapi.co/api/people`

async function obterPessoas(nome){
  const result = await get(`${URL}?search=${nome}&format=json`);
  return result.data.results.map(mapearPessoas)
}

function mapearPessoas(item){
  return {
    nome: item.name,
    peso: item.height
  }
}

module.exports = { obterPessoas }