
const ICrud = require('./../interfaces/interfaceICrud')
const Sequelize = require('sequelize');

class PostgresDB extends ICrud{
  constructor(connection, schema){
    super()
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    const {
      dataValues
    } = await this._schema.create(item)
    return dataValues
  }

  async read(item = {}){
    return this._schema.findAll({where: item, raw: true})
  }

  async update(id, item, upsert=false){
    const fn = upsert ? 'upsert' : 'update'
    return this._schema[fn](item, {where: {id: id}})
  }

  async delete(id){
    const query = id ? { id } : {}
    return this._schema.destroy({where: query})
  }

  async isConnected(){
    
    try {
      await this._connection.authenticate();
      return true
    } catch (error) {
      console.log('FAIL!', error)
      return false;
    }
    
  }

  static connect(){
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorAliases: false,
      ssl: process.env.SSL_DB,
      dialectOptions:{
        ssl: process.env.SSL_DB,
      },
      logging: false
    })
    return connection
  }

  static defineModel(connection, schema){
    const model = connection.define(schema.name, schema.schema, schema.options)
    model.sync();
    return model
  }
}

module.exports = PostgresDB