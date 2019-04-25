// docker exec -it afe83762348d mongo -u mjunior -p mjunior --authenticationDatabase heroes

use heroes
show collections
db.herois.insert({ nome: 'flash', poder: 'Valocidade', dataNascimento: 1999 - 01 - 01 })

db.herois.find()
db.herois.find().pretty();
db.herois.findOne()
db.herois.find().limit(10).sort({nome: -1})

for(let i =0;i<=10000;i++){
  db.herois.insert({ nome: `Clone - ${i}`, poder: 'Valocidade', dataNascimento: 1999 - 01 - 01 })
}


db.herois.find({nome: flash})

db.herois.update({ _id: ObjectId("5cbf52801c4fd33cd18a17fb") }, {nome: 'Tiao'})
db.herois.update({ _id: ObjectId("5cbf5334ab5567f218e901da") }, {$set: {nome: 'Tiao'}})