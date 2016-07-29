/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let m = require('./models/Measurement.js');
let C = require('./models/Config.js')
let Q = require('q');
let request = require('superagent');

function send(config, value) {
  let deferred = Q.defer();
  let message = "Nu är det " + value.measurement.toFixed(1) + " °C på balkongen."
  request.post("https://api.46elks.com/a1/SMS").type('form').send({
    message : message,
    from : "Temp",
    to : config.tel
  }).auth(config.username, config.password).end(function(err, cres) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    if(cres.status != 200) {
      return deferred.reject(new Error("Bad response status, " + cres.status));
    }

    config.lastSent = new Date();
    deferred.resolve(config);
  });

  return deferred.promise;
}

exports.ticker = function (req, res, next) {
  console.log("Running notifier...");
  let now = new Date();

  if(now.getHours() !== 22) { //TODO make it configurable?
    console.log("Time is not right, " + now.getHours());
    return next();
  }

  C.read().then(function(config) {
    if (false&&config.lastSent &&
        config.lastSent.getFullYear() === now.getFullYear() &&
        config.lastSent.getMonth() === now.getMonth() &&
        config.lastSent.getDate() === now.getDate()) {
      throw new Error("Has already notified today");
    }

    // TODO fix hardcoded value
    m.now("sensor2").then(function(value){
      return send(config, value);
    }).then(function(config) {
      return config.save();
    }).fail(function(error) {
      console.log(error);
    });
  }).fail(function(error){
    console.log(error);
  });

  next();
};
