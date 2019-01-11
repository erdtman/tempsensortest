/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const m = require('./models/Measurement.js');
const d = require('./models/Device.js');

exports.writeId = function(req, res) {
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
};

exports.readId = function(req, res) {
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
}
  
exports.now = function(req, res) {
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
};
  
exports.clean = function(req, res) {
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
};

exports.measurements = function(req, res) {
  let id = req.params.id ;
  let interval = req.query.interval || "HOUR";

  if (!id) {
      return res.status(400).send("missing parameter");
  }

  d.read(id).then(function(device) {
      return [device, m.listAgregate(id, interval)];
  }).spread(function (device, measurements) {
      res.setHeader('Content-Type', 'application/json');
      const data = {
          'measurements': measurements,
          'device': device
        };
      res.send(JSON.stringify(data));
  }).fail(function(error) {
      res.status(500).send(error);
  });
};
