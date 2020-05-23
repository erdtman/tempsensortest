/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');

const default_config = {
  "state": "TIMER",
  "schedule": {
      "00_0": false,
      "00_5": false,
      "01_0": false,
      "06_0": false,
      "11_5": false,
      "11_0": false,
      "10_5": false,
      "10_0": false,
      "09_5": false,
      "09_0": false,
      "08_5": false,
      "08_0": false,
      "07_5": false,
      "07_0": false,
      "06_5": false,
      "05_5": false,
      "05_0": false,
      "04_5": false,
      "04_0": false,
      "03_5": false,
      "03_0": false,
      "02_5": false,
      "02_0": false,
      "01_5": false,
      "13_0": false,
      "13_5": false,
      "14_0": false,
      "14_5": false,
      "15_0": false,
      "15_5": false,
      "16_0": false,
      "16_5": false,
      "17_0": false,
      "17_5": false,
      "18_0": false,
      "18_5": false,
      "19_0": false,
      "20_0": false,
      "19_5": false,
      "20_5": false,
      "21_0": false,
      "21_5": false,
      "22_0": false,
      "22_5": false,
      "23_0": false,
      "23_5": false,
      "12_0": false,
      "12_5": false
  }
}



exports.getDefaultConfig = () => {
  return JSON.parse(JSON.stringify(default_config));
}

exports.write = function(timer_config) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('timer_config');
    collection.save(timer_config, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.read = function(id) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('timer_config');

    collection.findOne({_id:id}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      if(!doc) {
        const newConfig = JSON.parse(JSON.stringify(default_config));
        newConfig._id = id;
        return resolve(newConfig);
      }

      resolve(doc);
    });
  });
};
