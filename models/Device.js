/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const Q = require('q');

function Device(device) {
  device = device || {};

  device.save = function(name) {
    let deferred = Q.defer();

    let collection = db.get().collection('device');
    device.name = name;
    collection.save(device, function(err, doc) {
      if (err) {
        return deferred.reject(new Error(err));
      }
      deferred.resolve(doc);
    });

    return deferred.promise;
  };
  return device;
}

exports.delete = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('device');
  collection.remove({'id': id}, function(err) {
    if (err) {
      return deferred.reject(err);
    };
    deferred.resolve();
  });
  return deferred.promise;
};


exports.getAll = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('device');
  collection.find({}).toArray(function(err, result) {
    if (err) {
      return deferred.reject(err);
    };
    deferred.resolve(result);
  });
  return deferred.promise;
};

exports.read = function(id) {
  let deferred = Q.defer();
  let collection = db.get().collection('device');

  collection.findOne({id:id}, function(err, doc) {
    if (err) {
      return deferred.reject(err);
    }

    if (!doc) {
      return deferred.reject();
    }
    deferred.resolve(new Device(doc));
  });

  return deferred.promise;
};


exports.create = function(id, name) {
  let deferred = Q.defer();

  let device = {
    "id" : id,
    "name" : name
  };

  let collection = db.get().collection('device');
  collection.save(device, function(err, doc) {
    if (err) {
      return deferred.reject(new Error(err));
    }

    deferred.resolve(doc);
  });

  return deferred.promise;
}
