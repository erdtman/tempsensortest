/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const Q = require('q');


exports.getAll = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('waitingdevices');
  collection.find({}).toArray(function(err, result) {
    if (err) {
      return deferred.reject(err);
    };
    deferred.resolve(result);
  });
  return deferred.promise;
};

exports.delete = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('waitingdevices');
  collection.remove({'id': id}, function(err) {
    if (err) {
      return deferred.reject(err);
    };
    deferred.resolve();
  });
  return deferred.promise;
};


exports.get = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('waitingdevices');
  collection.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 30 } )

  collection.findOne({'id': id}, function(err, doc) {
    if (err) {
      return deferred.reject(err);
    }

    if (doc) {
      return deferred.resolve(doc);
    }
    const waitingdevice = {
      'id': id,
      'createdAt': new Date()
    };

    collection.save(waitingdevice, function(err, doc) {
      if (err) {
        return deferred.reject(new Error(err));
      }

      deferred.resolve(doc);
    });
  });

  return deferred.promise;
};
