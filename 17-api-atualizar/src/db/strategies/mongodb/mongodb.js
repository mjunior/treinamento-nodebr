const ICrud = require('./../interfaces/interfaceICrud')
const Mongoose = require('mongoose')
class MongoDB extends ICrud {
  constructor(connection, schema) {
    super()
    this._schema = schema
    this._connection = connection
  }

  create(item) {
    return this._schema.create(item);
  }
  
  read(query,skip=0,limit=10) {
    return this._schema.find(query).skip(skip).limit(limit);
  }

  update(id,item) {
    return this._schema.updateOne({_id: id},{$set: item })
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id })
  }

  async isConnected() {
    const state = this._connection.readyState
    if(state != 2) return state
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    return this._connection.readyState
  }

  static connect() {
    Mongoose.connect('mongodb://mjunior:mjunior@localhost:27017/heroes', { useNewUrlParser: true }, function (error) {
      if (!error) return;
      console.log('ERROR CONNECTION', error)
    });

    const connection = Mongoose.connection
    
    connection.once('open', function () {
      console.log('database connected')
    })
    return connection
  }

}
module.exports = MongoDB