const mongodb = require('mongodb');
const express = require('express');

const app = express();

let db;
const connectionOptions = { poolSize: 3 };

mongodb.MongoClient.connect('mongodb://mongoadmin:secret@localhost:27888/?authSource=admin', connectionOptions, async function(err, database) {
  if (err) throw err;
  db = database.db('test');
  // create some documents required for demonstration
  db.collection("test").drop(function(err, delOK) {
    //if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });    
  db.collection('test').insertOne({"a": "b"});
  
  app.listen(process.env.PORT || 3000, function() {
    console.log(`Express.js server ups.`);
    console.log("Pool size: " + db.poolSize);
  });
});

app.get('/slow', function (req, res) {
  db.collection('test').find({'$where': 'sleep(5000) || true'}).toArray(function(err, cursor) {
    if (err) {
      console.log("Error: " + err);
    }
    return res.json({"docCount": 'docs'});
  });
	
});

app.get('/fast', function (req, res) {
  db.collection('test').countDocuments({}, function(err, count) {
    return res.json({'documentCount': count});
  });
	
});
