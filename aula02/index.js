/**
 * 0. Obter um
 * 1. Obter o numero de telefone de algum ususario a partir de seu id
 * 2. Obter o endereco
*/

const util = require('util')
const getAddressAsync = util.promisify(getAddress)
function getUser(){
  return new Promise(function resolvePromise(resolve, reject){
    setTimeout(function(){
      return resolve({
        id: 1,
        nome: 'Aladin',
        birthdate: new Date()
      })
    }, 1000)
  })
}

function getPhone(idUser, callback){
  return new Promise(function resolvePromise(resolve, reject){
    setTimeout(function(){
      return resolve({
        telefone: '87040370 ',
        ddd: 11
      })
    }, 2000)
  })
}

function getAddress(idUser, callback){
  setTimeout(function(){
    return callback(null, {
      city: 'Barbacena',
      street: 'Rua felipe paulo'
    })
  }, 2000)
}


const userPromise = getUser()


userPromise
  .then(function(usuario){
    return getPhone(usuario.id).then(function(result){
      return{
        usuario: usuario,
        telefone: result
      }
    })
  })
  .then(function(resultado){
    const endereco = getAddressAsync(resultado.usuario.id) 
    return endereco.then(function resolveEndereco(result){
      return {
        usuario: resultado.usuario,
        telefone: resultado.telefone,
        endereco: result
      }
    })
  })
  .then(function(resultado){
    console.log(`
      Nome: ${resultado.usuario.nome},
      Endereco: ${resultado.endereco.city},
      Telefone: ${resultado.telefone.telefone}
    `)
  })
  .catch(function(error){
    console.log('PROBLEMA', error)
  })


// getUser(function userResolve(error, usuario){
//   if(error){
//     console.error('Erro ao obter usuario', error)
//     return;
//   }
//   console.log('usuario', usuario)
//   getPhone(usuario.id, function phoneResolve(erro1, telefone){
//     if(erro1){
//       console.error('Erro ao obter telefone', erro1)
//       return;
//     }
//     console.log('telefone', telefone)

//     getAddress(usuario.id, function addressResolve(error2, address){
//       if(error2){
//         console.error('Erro ao obter endereco', erro2)
//         return;
//       }
//       console.log(`
//         Nome: ${usuario.nome},
//         Endereco ${address.city},
//         Telefone: ${telefone.telefone}
//       `)
//     })
//   })
// });
//  const telefone = getPhone(usuario.id);
//  console.log('telefone', telefone)


//['content']['shipment_order_volume_array'][**ARRAY_INDEX**]['shipment_order_volume_state_history_array'][**ARRAY_INDEX**]['shipment_volume_micro_state']['default_name']
//['content']['shipment_order_volume_array'][**ARRAY_INDEX**]['shipment_order_volume_state_history_array'][**ARRAY_INDEX**]['shipment_volume_micro_state']['name']
//['content']['shipment_order_volume_array'][**ARRAY_INDEX**]['shipment_order_volume_state_history_array'][**ARRAY_INDEX**]['shipment_volume_micro_state']['default_name']