/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');

exports.create = function(id) {
  const deferred = Q.defer();

  const tick = {
    "id" : id,
    "time": new Date().getTime()
  };

  const collection = db.get().collection('ticks');
  collection.save(tick, function(err, doc) {
    if (err) {
      deferred.reject(new Error(err));
      return;
    }

    deferred.resolve(doc);
  });

  return deferred.promise;
};

const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;
const DAY = HOUR*24;
const WEEK = DAY*7
const MONTH = DAY*30;

const mapping = {
  "MINUTE": MINUTE,
  "HOUR": HOUR,
  "DAY": DAY,
  "WEEK": WEEK,
  "MONTH": MONTH,
}

exports.readLast = function(id, interval) {
  const deferred = Q.defer();
  if (!mapping[interval]) {
    deferred.reject(new Error("Unknown interval, " + interval));
    return deferred.promise;
  }
  console.log("tick interval: " + interval);
  
  const now = new Date().getTime();
  const start = now - mapping[interval];
  const collection = db.get().collection('ticks');
  collection.count({id:id, time:{"$gte":start}}).then(function(count){
    console.log("tick count: " + count);
    deferred.resolve(count);
  });
  
  return deferred.promise;
}

exports.history = function(id, interval) {
  const deferred = Q.defer();
  const collection = db.get().collection('ticks');
  let start = 0;
  let chunk = 0;
  const now = new Date().getTime();

  console.log("interval: " + interval);

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
        '_id' : {"$multiply" : [{ "$trunc" : {'$divide' : ['$time', chunk ]}}, chunk]},
        "count": { "$sum": 1 }
    }},
    { "$sort" : {'_id' : 1}}
  ]).toArray(function(err, docs) {
    if (err) {
      return deferred.reject(new Error(err));
    }
    deferred.resolve(docs);
  });
  return deferred.promise;
}
