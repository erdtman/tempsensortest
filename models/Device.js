/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');


exports.write = function(device_config) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('device_config');
    collection.save(device_config, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.read = function(id) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('device_config');

    collection.findOne({_id:id}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      if(!doc) {
        const newConfig = {shoul_run: "baseline"};
        newConfig._id = id;
        return resolve(newConfig);
      }

      resolve(doc);
    });
  });
};
