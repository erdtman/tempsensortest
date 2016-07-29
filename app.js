/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let m = require('./models/Measurement.js');
let c = require('./models/Config.js');
let Notifier = require('./Notifier.js');
let db = require('./db.js');

let url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/my_database_name';
let port = process.env.PORT || 5000;

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(Notifier.ticker);

app.set('port', port);
app.set('etag', false);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  var id = "sensor2"; // TODO change this hardcoded value
  m.now(id).then(function(value) {
    value.measurement = value.measurement.toFixed(1);
    response.render('index',value);
  }).fail(function(error) {
    response.render('index', {
      "id" : "",
      "measurement" : "",
      "time": ""
    });
  });
});

app.get('/config', function(req, res) {
  c.read().then(function(config) {
    res.render('config', config);
  }).fail(function(error) {
    res.status(500).send(error);
  });
});

app.post('/config', function(req, res) {
  c.read().then(function(config) {
    config.username = req.body.username || config.username;
    config.password = req.body.password || config.password;
    config.tel = req.body.tel || config.tel;
    return config.save();
  }).then(function() {
    return res.redirect('/config');
  }).fail(function(error) {
    res.status(500).send(error);
  });
});

app.post('/measurement/:id', function(req, res) {
  let id = req.params.id;
  let value = req.body.value;

  if (!id || !value) {
    return res.status(400).send("missing parameter");
  }
  // TODO emit timer event to scheduler
  m.create(id, value).then(function(measurement) {
    res.status(201).send();
  }).fail(function(error) {
    res.status(500).send(error);
  });
});


app.get('/measurement/:id', function(req, res) {
  let id = req.params.id ;
  let interval = req.query.interval || "HOUR";

  if (!id) {
    return res.status(400).send("missing parameter");
  }

  m.listAgregate(id, interval).then(function(values){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(values));
  }).fail(function(error) {
    res.status(500).send(error);
  });
});


app.get('/measurement/:id/now', function(req, res) {
  let id = req.params.id ;

  if (!id) {
    return res.status(400).send("missing parameter");
  }
  m.now(id).then(function(value) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(value));
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
