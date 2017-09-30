/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const m = require('./models/Measurement.js');
const c = require('./models/Config.js');
const d = require('./models/Device.js');
const wd = require('./models/WaitingDevice.js');

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
    console.log(data);
    res.send(JSON.stringify(data));
  }).fail(function(error) {
    console.log(error);
    res.status(500).send(error);
  });
};
