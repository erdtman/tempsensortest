/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const db = require('../db');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7

const getStart = (interval) => {
  if (interval=== "TOTAL") {
    return 0;
  }

  if (interval === "5_MIN") {
    const now = new Date().getTime();
    return now - MINUTE * 5;
  }

  return moment().startOf(interval).valueOf();
}

const translateInterval = (interval) => {
  return (interval === "WEEK" ? 'isoWeek' : interval);
}

/*
 * Returns [steps, stepsize, format]
 */
const getParameters = (interval, start_date) => {
  if (interval === "DAY") {
    return [24, HOUR, "HH:mm"];
  }

  if(interval === "MONTH") {
    return [start_date.daysInMonth(), DAY, "Do"];
  }

  if(interval === "YEAR") {
    return [start_date.weeksInYear(), WEEK, "[Vecka] W"];
  }
  throw Error(`Unknown interval '${interval}'`)
}

const getBoundry = (start, index, stepsize) => {
  return start + (index * stepsize);
}

exports.create = function (id, tick_count) {
  const tick = {
    "id": id,
    "time": new Date().getTime()
  };

  if (tick_count) {
    tick.tick_count = parseInt(tick_count, 10);
  }

  const collection = db.get().collection('ticks');
  collection.insertOne(tick);
};

exports.read = function (id, interval) {
  return new Promise(async (resolve) => {
    const localInterval = translateInterval(interval);
    const start = getStart(localInterval);
    const collection = db.get().collection('ticks');
    const list = await collection.aggregate([
      { $match: { "id": id, time: { $gte: start } } }]).toArray();

    resolve(list); // TODO set correct divition
  });
}

exports.readLast = function (id, interval, multiplyWith) {
  return new Promise(async (resolve) => {
    const localInterval = translateInterval(interval);
    const start = getStart(localInterval);
    const collection = db.get().collection('ticks');
    const count = await collection.aggregate([
      { $match: { "id": id, time: { $gte: start } } },
      { $group: {
        _id : null,
        ticks : {
          $sum: {
            $ifNull: [ "$tick_count", 1 ]
          }
        }
      }
    }]).next();

    if (!count) {
      return resolve(0);
    }

    resolve(count.ticks / 1000 * multiplyWith); // TODO set correct divition
  });
}

exports.readPeriod = function (id, interval, start_date) {
  return new Promise(async (resolve, reject) => {
    const localInterval = translateInterval(interval)
    const start = start_date.startOf(localInterval).valueOf();
    const end = start_date.endOf(localInterval).valueOf();
    const collection = db.get().collection('ticks');

    const count = await collection.aggregate([
      { $match: { "id": id, $and: [
        {time: { $gte: start }},
        {time: { $lte: end }}
      ] } },
      { $group: {
        _id : null,
        ticks : {
          $sum: {
            $ifNull: [ "$tick_count", 1 ] // handle old values without tick count
          }
        }
      }
    }]).next();

    if(count === null) {
      return resolve(0)
    }

    resolve(count.ticks / 1000);
  });
}

exports.readPeriodMax = function (id, interval, start_date) {
  return new Promise(async (resolve, reject) => {
    const localInterval = translateInterval(interval)
    const start = start_date.startOf(localInterval).valueOf();
    const end = start_date.endOf(localInterval).valueOf();
    const collection = db.get().collection('ticks');

    const count = await collection.aggregate([
      { $match: { "id": id, $and: [
        {time: { $gte: start }},
        {time: { $lte: end }}]}},
      { $sort: {"tick_count": -1 }}]).next();

    if(count === null) {
      return resolve(0)
    }

    resolve({
      kw: count.tick_count * 60 / 1000, // value for one minute so multiply with 60
      time: moment(count.time).format("YYYY-MM-DD HH:mm")
    });
  });
}

exports.history = function (id, interval, start_date) {
  return new Promise(async (resolve) => {
    start_date = start_date || moment()

    const collection = db.get().collection('ticks');
    const start = start_date.startOf(interval).valueOf();
    const end = start_date.endOf(interval).valueOf();
    const [steps, stepsize, format] = getParameters(interval, start_date);

    const boundaries = new Array(steps)
    .fill(1)
    .reduce((acc, _, index) => [...acc, getBoundry(start, index, stepsize)], []);

    const buckets = {};
    boundaries.forEach(id => {
      buckets[id] = {
        label: moment(id).format(format),
        ticks: 0,
        kwh: 0
      }
    });

    const docs = await collection.aggregate([
      { "$match": { "id": id, $and: [
        {time: { $gte: start }},
        {time: { $lte: end }}
      ] } },
      {
        "$bucket": {
          "groupBy": "$time",
          "boundaries": boundaries,
          "default": "Other",
          output: {
            "ticks": { $sum: {$ifNull: [ "$tick_count", 1 ]} },
          }
        }
      },
      { "$addFields": { "kwh": { '$divide': ['$ticks', 1000] } } },
      { "$sort": { '_id': 1 } }
    ]).toArray();

    docs
    .filter(doc => doc._id !== "Other")
    .forEach(doc => {
      buckets[doc._id].kwh = doc.kwh;
      buckets[doc._id].ticks = doc.ticks;
    });
    resolve(Object.values(buckets));
  });
}
