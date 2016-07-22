/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');

exports.create = function(id, value) {
  let deferred = Q.defer();

  if(parseInt(value) < -50 || parseInt(value) > 50) {
    return deferred.reject(new Error("ignoring unresonable value"));
  }

  let measurement = {
    "id" : id,
    "measurement" : value,
    "time": new Date().getTime()
  };

  let collection = db.get().collection('measurement');
  collection.save(measurement, function(err, doc) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(doc);
  });

  return deferred.promise;
};

exports.list = function(id, start, end) {
  let deferred = Q.defer();
  let collection = db.get().collection('measurement');

  collection.find({id:id, time : {$gte: start }}).toArray(function(err, docs) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(docs);
  });
  return deferred.promise;
};

exports.now = function(id, start, end) {
  let deferred = Q.defer();
  let collection = db.get().collection('measurement');

//time : {$gte: new Date().getTime()-(10*60*1000) }
  collection.find({id:id}).sort({"measurement":1}).limit(1).each(function(err, doc) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(doc);
  });
  return deferred.promise;
};
