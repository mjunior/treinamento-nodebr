const EventMitter = require ('events')
class MeuEmissor extends EventMitter{

}


const meuEmissor = new MeuEmissor();
const nomeEvento = 'usuario:click';

meuEmissor.on(nomeEvento, function(click){
  console.log('um usuario clicou', click)
})

setInterval(function(){
  meuEmissor.emit(nomeEvento, 'na barra de rolagem')
  meuEmissor.emit(nomeEvento, 'NO OK')
},1000)