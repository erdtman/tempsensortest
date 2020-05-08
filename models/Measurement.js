/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");

exports.create = function(id, value) {
  return new Promise((resolve, reject) => {
    if (parseFloat(value) < -50 || parseFloat(value) > 50) {
      reject(new Error(`Ignoring unresonable value, ${value}`));
    }

    const measurement = {
      "id" : id,
      "measurement" : parseFloat(value),
      "time": new Date().getTime()
    };

    const collection = db.get().collection('measurement');
    collection.save(measurement, function(err, doc) {
      if (err) {
        return reject(new Error(err));
      }

      resolve(doc);
    });
  });
};

const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;
const DAY = HOUR*24;
const WEEK = DAY*7
const MONTH = DAY*30;

exports.listAgregate = function(id, interval) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('measurement');
    const now = new Date().getTime();
    let start = 0;
    let chunk = 0;

    console.log(`Measurement:listAgregate - interval: ${interval}`);

    if (interval === "HOUR") {
      start = now - HOUR;
      chunk = MINUTE * 2;
    } else if (interval === "DAY") {
      start = now - DAY;
      chunk = MINUTE * 30;
    } else if (interval === "WEEK") {
      start = now - WEEK;
      chunk = HOUR * 3;
    } else if (interval === "MONTH") {
      start = now - MONTH;
      chunk = HOUR * 6;
    } else {
      deferred.reject(new Error("Unknown interval, " + interval));
      return deferred.promise;
    }

    collection.aggregate([
      { "$match": { "id": id, time : {$gte: start }}},
      { "$group": {
          '_id' : {"$multiply" : [{'$subtract' :[{'$divide' : ['$time', chunk ]},{ '$mod' : [{'$divide' : ['$time', chunk ]},1] } ] }, chunk]},
          "measurement" : { "$avg" : "$measurement" }
      }},
      { "$sort" : {'_id' : 1}}
    ]).toArray(function(err, docs) {
      if (err) {
        return reject(new Error(err));
      }
      const augumented = docs.map(doc => ({
        'measurement': doc.measurement,
        'label': moment(doc._id).format('HH:mm')}));
      console.log(augumented);

      resolve(augumented);
    });
  });
}

exports.now = function(id) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('measurement');

    collection
    .find({id:id})
    .sort({"time": -1})
    .limit(1)
    .each(function(err, doc) {
      if (err) {
        return reject(new Error(err));
      }

      resolve(doc);
    });
  });
};
