/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');

exports.create = function(id, value) {
  let deferred = Q.defer();
  
  if(parseFloat(value) < -50 || parseFloat(value) > 50) {
    deferred.reject(new Error("ignoring unresonable value"));
    return deferred.promise;
  }

  let measurement = {
    "id" : id,
    "measurement" : parseFloat(value),
    "time": new Date().getTime()
  };

  let collection = db.get().collection('measurement');
  
  //collection.find({id:id}).sort({"time":-1}).limit(1).each(function(err, doc) {
  collection.find({id:id}).limit(2).each(function(err, doc) {
    if (err) {
      return deferred.reject(new Error(err));
    }
    console.log("deleting");
    console.log(doc);
  });

  collection.save(measurement, function(err, doc) {
    if (err) {
      console.log("====== error ======");
      console.log(err);
      deferred.reject(new Error(err));
      return deferred.promise;
    }

    deferred.resolve(doc);
  });

  return deferred.promise;
};

var SECOND = 1000;
var MINUTE = SECOND*60;
var HOUR = MINUTE*60;
var DAY = HOUR*24;
var WEEK = DAY*7
var MONTH = DAY*30;
var interval = HOUR;

exports.listAgregate = function(id, interval) {
  let deferred = Q.defer();
  let collection = db.get().collection('measurement');
  let start = 0;
  let chunk = 0;
  let now = new Date().getTime();

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
        //'_id' : {"$multiply" : [{ "$trunc" : {'$divide' : ['$time', chunk ]} }, chunk]},
        '_id' : {"$multiply" : [{'$subtract' :[{'$divide' : ['$time', chunk ]},{ '$mod' : [{'$divide' : ['$time', chunk ]},1] } ] }, chunk]},
        "measurement" : { "$avg" : "$measurement" }
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

exports.now = function(id, start, end) {
  let deferred = Q.defer();
  let collection = db.get().collection('measurement');

  collection.find({id:id}).sort({"time":-1}).limit(1).each(function(err, doc) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(doc);
  });
  return deferred.promise;
};
