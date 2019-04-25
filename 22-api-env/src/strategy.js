class NotImplementedException extends Error{
  constructor(){
    super('Not implemented Exception')
  }
}

class ICrud {
  create(item){
    throw new NotImplementedException()
  }

  read(query){
    throw new NotImplementedException()
  }

  update(id, item){
    throw new NotImplementedException()
  }

  delete(id){
    throw new NotImplementedException()
  }
}

class MongoDB extends ICrud{
  constructor(){
    super()
  }

  create(item){
    console.log('Criando item no MONGODB')
  }
}


class PostgresDB extends ICrud{
  constructor(){
    super()
  }

  create(item){
    console.log('Criando item no POSTGRES')
  }
}

class ContextStrategy{
  constructor(strategy){
    this._database = strategy
  }

  create(item){
    return this._database.create(item)
  }

  read(item){
    return this._database.read(item)
  }

  read(id, item){
    return this._database.update(id, item)
  }

  delete(id){
    return this._database.delete(id)
  }
}




const contextMongo = new ContextStrategy( new PostgresDB())

contextMongo.create('{}')