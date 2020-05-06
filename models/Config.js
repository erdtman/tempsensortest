/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');

const REF = "adfhaskdjadsjkfhasdfjhasldkfhaskd";

function Config(config) {
  config = config || { "ref" : REF };

  config.save = function() {
    return new Promise((resolve, reject) => {
      const collection = db.get().collection('config');
      collection.save(config, function(err, doc) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };
  return config;
}

exports.read = function() {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('config');

    collection.findOne({ref:REF}, function(err, doc) {
      if (err) {
        return reject(err);
      }
      resolve(new Config(doc));
    });
  });
};
