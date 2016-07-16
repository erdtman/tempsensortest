/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let m = require('./models/Measurement.js');
let db = require('./db.js');

let url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/my_database_name';
let port = process.env.PORT || 5000;

app.set('port', port);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  response.render('index');
});

app.post('/measurement/:id', function(req, res) {
  let id = req.params.id;
  let value = req.body.value;

  if (!id || !value) {
    return res.status(400).send("missing parameter");
  }

  m.create(id, value).then(function(measurement) {
    res.status(201).send();
  }).fail(function(error) {
    res.status(500).send(error);
  });
})

app.get('/measurement/:id', function(req, res) {
  let id = req.params.id ;

  if (!id) {
    return res.status(400).send("missing parameter");
  }

  m.list(id).then(function(values){
    res.send(values);
  }).fail(function(error) {
    res.status(500).send(error);
  });
})

db.connect(url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
  } else {
    console.log('Connection established to', url);
    let server = app.listen(port, function() {
      let host = server.address().address;
      let port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  }
});
