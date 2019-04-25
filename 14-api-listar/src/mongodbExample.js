const Mongoose = require('mongoose')

Mongoose.connect('mongodb://mjunior:mjunior@localhost:27017/heroes',
  { useNewUrlParser: true }, function(error){
    if(!error) return;
    console.log('ERROR CONNECTION', error)
  });

const connection = Mongoose.connection
connection.once('open', function(){
  console.log('database connected')
})


const heroisSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  poder: {
    type: String,
    required: true
  },
  insertedAt:{
    type: Date,
    default: new Date()
  }
})

const model = Mongoose.model('herois', heroisSchema)

async function main(){
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro'
  });
  console.log('resultCadastrar', resultCadastrar);


  const listResult = await model.find({})

  console.log('listResult', listResult)
} 
main();