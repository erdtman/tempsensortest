/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');

exports.create = function(id, value) {
  let deferred = Q.defer();
  let measurement = {
    "id" : id,
    "measurement" : value,
    "time": new Date()
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

exports.list = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('measurement');

  collection.find({id:id}).toArray(function(err, docs) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(docs);
  });
  return deferred.promise;
};
