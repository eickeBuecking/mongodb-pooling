const _ = require('lodash');

const MongoClient=require('mongodb').MongoClient;
const connect_uri = 'mongodb://mongoadmin:secret@localhost:27888/?authSource=admin&maxPoolSize=1';
const client = new MongoClient(connect_uri, { monitorCommands:true, useUnifiedTopology:true });
let connection;
//client.on('commandStarted', (event) => console.debug(event));
//client.on('commandSucceeded', (event) => console.debug(event));
//client.on('commandFailed', (event) => console.debug(event));
//client.on('connectionPoolCreated', (event) => console.debug(event));

let connectionMap = {}

exports.getConnectionByTenant = async (tenantId) => {
  console.log(`[connectionManager.js] Getting connection for ${tenantId}`)
  if (!_.isEmpty(connectionMap)) {
    const connection = connectionMap[tenantId]
    if (connection) return connection
  }
  return await initMongoDB(tenantId);
}

const initMongoDB = async (key) => {
  console.log('[initMongoDB.js]', 'Initializing Mongo Connection for Key =>', key)
  if (_.isEmpty(connection)) {
    console.log("Initial connect");
    connection = await client.connect();
  }
  try {
    
    db = await connection.db('test' + key);
    connectionMap[key] = db;
    db.collection("test").drop(function(err, delOK) {
        //if (err) throw err;
        if (delOK) console.log("Collection deleted");
    });    
    db.collection('test').insertOne({"a": "b"});
    

    return db;
  } catch (error) {
    console.log('[initMongoDB.js]', `MongoDB -> Failed to Connect to MongoDB`)
    console.log('[initMongoDB.js]', error)
  }
}
