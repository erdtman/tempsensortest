/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');
const moment = require('moment');

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
const YEAR = DAY*365;

const mapping = {
  "MINUTE": MINUTE,
  "HOUR": HOUR,
  "DAY": DAY,
  "WEEK": WEEK,
  "MONTH": MONTH,
  "YEAR": YEAR
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
    deferred.resolve((count/500).toFixed(2));
  });
  
  return deferred.promise;
}



exports.history = function(id, interval) {
  const deferred = Q.defer();
  const collection = db.get().collection('ticks');
  let start = 0;
  let now = new Date().getTime();

  console.log("interval: " + interval);
  
  let stepsize = 0;
  let steps = 0;
  let format = ""
  if (interval === "HOUR") {
    stepsize = (5*MINUTE)
    steps = 24;
    format = "HH:mm";
  } else if (interval === "DAY") {
    stepsize = HOUR;
    steps = 24;
    format = "dddd HH:mm";
  } else if (interval === "MONTH") {
    stepsize = DAY;
    steps = 30;
    format = "YYYY-MM-DD";
  } else if (interval === "YEAR") {
    stepsize = WEEK;
    steps = 52;
    format = "w ww";    
  }
  
  now -= (now % stepsize);
  start = now - (steps * stepsize)
  
  const boundaries = [];
  for(let i = 0; i <= steps; i++) {
    boundaries.push(start + (i*stepsize));
  }

  collection.aggregate([
    { "$match": { "id": id, time : {$gte: start }}},
    { "$bucket": {
       "groupBy": "$time",
       "boundaries": boundaries,
       "default": "Other",
       output: {
         "ticks": { $sum: 1 },
       }
    }},
    { "$addFields": { "kwh": {'$divide' : ['$ticks', 500 ]}}},
    { "$sort" : {'_id' : 1}}
  ]).toArray(function(err, docs) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    docs = docs
    .filter(doc => {
      return doc._id !== "Other";
    })
    .map(doc => {
      doc.label = moment(doc._id).format(format);
      return doc;
    })

    deferred.resolve(docs);
  });
  return deferred.promise;
}
