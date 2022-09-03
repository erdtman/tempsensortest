/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");


const ID = "VERY_UNIQUE_ID_123_FREZER"

exports.write = function(water) {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('frezer');

    collection.replaceOne({_id:ID}, water, { upsert: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.read = function() {
  return new Promise((resolve, reject) => {
    const collection = db.get().collection('frezer');

    collection.findOne({_id:ID}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      if(!doc) {
        const newWater = {
            measurements : []
        }
        newWater._id = ID;
        return resolve(newWater);
      }

      resolve(doc);
    });
  });
};
