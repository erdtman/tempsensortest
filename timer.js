/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const c = require('./models/Config.js');
const moment = require('moment');

function getTimerValue() {
    const now = moment();
    const nowString = now.format("YYYY-MM-DD");
    const tOOOO = moment(nowString + " 00:00:00.000+01:00");
    const t0500 = moment(nowString + " 05:00:00.000+01:00");
    const t0800 = moment(nowString + " 09:00:00.000+01:00");
    const t1530 = moment(nowString + " 15:00:00.000+01:00");
    const t2400 = moment(nowString + " 24:00:00.000+01:00");

    if (now.isBetween(tOOOO, t0500)) {  // 00:00 -> 05:00 - OFF
      return "OFF";
    }
    if (now.isBetween(t0500, t0800)) {  // 05:00 -> 08:00 - ON
      return "ON";
    }
    if (now.isBetween(t0800, t1530)) {  // 08:00 -> 15:00 - OFF
      return "OFF";
    }
    if (now.isBetween(t1530, t2400)) {  // 15:00 -> 24:00 - ON
      return "ON";
    }

    return "OFF";
}

exports.timer = function(req, res) {
    c.read().then(function(config) {
      if(config.timer_state === "ON") {
        return res.send("ON");
      }
      if(config.timer_state === "OFF") {
        return res.send("OFF");
      }
      res.send(getTimerValue());
    }).fail(function(error) {
      res.send(getTimerValue());
    });
};

function getNextState(currentState) {
  if (currentState === "ON") {
    return "OFF"
  }
  if (currentState === "OFF") {
    return "timer"
  }
  if (currentState === "timer") {
    return "ON"
  }

  return "timer"
}

exports.timerSettings = function(req, res) {
  c.read().then(function(config) {
    config.timer_state = getNextState(config.timer_state);
    return config.save();
  }).then(function() {
    return res.redirect('/timer/settings');
  }).fail(function(error) {
    res.status(500).send(error);
  });
}

exports.timerView = function(req, res) {
  c.read().then(function(config) {
    res.render('timer', config);
  }).fail(function(error) {
    res.status(500).send(error);
  });
}

exports.saveTimerSettings = async function(req, res) {
  try {
    const config = await c.read();
    config.timer_state_v2 = req.body;
    await config.save(); // Just wait for the sake of it
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.readTimerSettings = async function(req, res) {
  const config = await c.read();
  res.send(config.timer_state_v2);
}