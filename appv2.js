/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const m = require('./models/Measurement.js');
const d = require('./models/Device.js');
const moment = require('moment');

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


exports.timer = function(req, res) {
  const now = moment();
  const nowString = now.format("YYYY-MM-DD");
  const tOOOO = moment(nowString + " 00:00:00.000+01:00"); 
  const t0500 = moment(nowString + " 05:00:00.000+01:00");
  const t0800 = moment(nowString + " 08:00:00.000+01:00");
  const t1530 = moment(nowString + " 15:30:00.000+01:00");
  const t2400 = moment(nowString + " 24:00:00.000+01:00");

  const operation = {};
  if (now.isBetween(tOOOO, t0500)) {        // 00:00 -> 05:00 - OFF
    operation.state = "OFF";
  } else if (now.isBetween(t0500, t0800)) { // 05:00 -> 08:00 - ON
    operation.state = "ON";
  } else if (now.isBetween(t0800, t1530)) { // 08:00 -> 15:00 - OFF
    operation.state = "OFF";
  } else if (now.isBetween(t1530, t2400)) { // 15:00 -> 24:00 - ON
    operation.state = "OFF";
  } else { // off
    operation.state = "OFF";
  }

  res.send(operation.state);
};
