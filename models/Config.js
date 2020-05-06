/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

let db = require('../db');
let Q = require('q');

let REF = "adfhaskdjadsjkfhasdfjhasldkfhaskd";

function Config(config) {
  config = config || { "ref" : REF };

  config.save = function() {
    let deferred = Q.defer();

    let collection = db.get().collection('config');
    collection.save(config, function(err, doc) {
      if (err) {
        return deferred.reject(new Error(err));
      }
      deferred.resolve();
    });

    return deferred.promise;
  };
  return config;
}

exports.read = function() {
  let deferred = Q.defer();
  let collection = db.get().collection('config');

  collection.findOne({ref:REF}, function(err, doc) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(new Config(doc));
  });
  return deferred.promise;
};
