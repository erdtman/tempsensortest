/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

var MongoClient = require('mongodb').MongoClient;

var state = {
  db: null,
};

exports.connect = async function(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (state.db) {
        return resolve();
      }
      const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
         retryWrites: false });
      state.db = client.db();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.get = function() {
  return state.db;
};

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
};
