const ContextStrategy = require('./db/strategies/base/contextStrategy')
const PostgresDB = require('./db/strategies/postgres');
const mongoDB = require('./db/strategies/mongodb');

const contextPostgres = new ContextStrategy( new PostgresDB())
contextPostgres.create('{}')

const contextMongo = new ContextStrategy(new mongoDB())
contextMongo.create('{}')