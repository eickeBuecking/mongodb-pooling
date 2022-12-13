const _ = require('lodash');

const mongodb = require('mongodb');
const connector = require('./connector-service')
const express = require('express');

const app = express();

let db;

app.listen(process.env.PORT || 3000, function() {
  console.log(`Express.js server ups.`);
});

app.get('/slow', async function (req, res) {
  let tenant = req?.query?.tenant;
  if (_.isEmpty(tenant)){
    tenant = "default";
  }
  let my_db = await connector.getConnectionByTenant(tenant);

  my_db.collection('test').find({'$where': 'sleep(5000) || true'}).toArray(function(err, cursor) {
    if (err) {
      console.log("Error: " + err);
    }
    return res.json({"docCount": 'docs'});
  });
	
});

app.get('/fast', async function (req, res) {
  let tenant = req?.query?.tenant;
  if (_.isEmpty(tenant)){
    tenant = "default";
  }
  let my_db = await connector.getConnectionByTenant(tenant);
  my_db.collection('test').countDocuments({}, function(err, count) {
    return res.json({'documentCount': count});
  });
	
});
