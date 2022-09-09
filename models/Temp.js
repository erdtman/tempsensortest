/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");



exports.write = function(water, id) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('temp');

    collection.replaceOne({_id:id}, water, { upsert: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.read = function(id) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('temp');

    collection.findOne({_id:id}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      if(!doc) {
        const newWater = {
            measurements : []
        }
        newWater._id = id;
        return resolve(newWater);
      }

      resolve(doc);
    });
  });
};
