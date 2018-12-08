/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const m = require('./models/Measurement.js');
const c = require('./models/Config.js');
const d = require('./models/Device.js');
const wd = require('./models/WaitingDevice.js');
const Notifier = require('./Notifier.js');
const db = require('./db.js');
const appv2 = require('./appv2.js');

const url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/my_database_name';
const port = process.env.PORT || 5000;

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(Notifier.ticker);

app.set('port', port);
app.set('etag', false);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  var id = "2c001f000147353138383138"; // TODO change this hardcoded value
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

app.get('/timer/', appv2.timer);

app.get('/config', function(req, res) {
  c.read().then(function(config) {
    res.render('config', config);
  }).fail(function(error) {
    res.status(500).send(error);
  });
});

app.get('/deviceconfig', function(req, res) {
  let waitingDevices = [];
  wd.getAll().then(function(readWaitingDevices) {
    waitingDevices = readWaitingDevices
    return d.getAll()
  }).then(function(devices) {
    const data = {
      'waitingdevices': waitingDevices,
      'devices': devices
    };
    res.render('deviceconfig', data);
  }).fail(function(error) {
    res.status(500).send(error);
  });
});

app.get('/deviceconfig/:id', function(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("missing id parameter");
  }

  d.read(id).then(function(device) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(device));
  }).fail(function(error) {
    if(error) {
      res.status(500).send(error);
    }

    wd.get(id).then(function(waitingdevice) {
      res.status(202).send();
    }).fail(function(error) {
      res.status(500).send(error);
    });
  });
});

app.post('/deviceconfig/:id', function(req, res) {
  let id = req.params.id;
  let name = req.body.deviceName;

  if (!id || !name) {
    return res.status(400).send("missing parameter");
  }

  d.create(id, name).then(function(device) {
    return wd.delete(id);
  }).then(function(config) {
    return res.redirect('/deviceconfig');
  }).fail(function(error) {
    res.status(500).send(error);
  });
});

app.get('/deviceconfig/:id/delete', function(req, res) {
  let id = req.params.id;

  if (!id) {
    return res.status(400).send("missing parameter");
  }

  d.delete(id).then(function(device) {
    return res.redirect('/deviceconfig');
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

app.get('/v2/measurement/:id', appv2.measurements);


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

app.get('/measurement/:id/clean', function(req, res) {
  let id = req.params.id ;

  if (!id) {
    return res.status(400).send("missing parameter");
  }

  if (id === 'sensor2'){ // Temporary hack
    id = '2c001f000147353138383138';
  }

  m.now(id).then(function(value) {
    res.send(value.measurement.toFixed(0));
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
      console.log("Listening at http://%s:%s", host, port);
    });
  }
});
