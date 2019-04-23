const ICrud = require('./interfaces/interfaceICrud')
const Mongoose = require('mongoose')
class MongoDB extends ICrud {
  constructor() {
    super()
    this._herois = null
    this._driver = null
  }

  create(item) {
    return this._herois.create(item);
  }
  
  read(query,skip=0,limit=10) {
    return this._herois.find(query).skip(skip).limit(limit);
  }

  update(id,item) {
    return this._herois.updateOne({_id: id},{$set: item })
  }

  delete(id) {
    return this._herois.deleteOne({ _id: id })
  }
  
  defineModel() {
    const heroiSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true
      },
      poder: {
        type: String,
        required: true
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    })

    this._herois = Mongoose.model('herois', heroiSchema)
  }

  async isConnected() {
    const state = this._driver.readyState
    if(state != 2) return state
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    return this._driver.readyState
  }

  async connect() {
    Mongoose.connect('mongodb://mjunior:mjunior@localhost:27017/heroes', { useNewUrlParser: true }, function (error) {
      if (!error) return;
      console.log('ERROR CONNECTION', error)
    });

    const connection = Mongoose.connection
    connection.once('open', function () {
      console.log('database connected')
    })
    this._driver = connection;
    await this.defineModel()
  }

}
module.exports = MongoDB