/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('./models/Tick.js');

exports.tick = function(req, res) {
    const id = req.params.id ;
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
  
    t.create(id).then(function() {
        res.send();
    }).fail(function(error) {
        res.status(500).send(error);
    });
};

exports.powerConsumption = function(req, res){
    const id = req.params.id ;
    const interval = req.query.interval || "HOUR";
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
    console.log("power id: " + id);
    
    t.readLast(id, interval).then(function(value) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    }).fail(function(error) {
        res.status(500).send(error);
    });
}