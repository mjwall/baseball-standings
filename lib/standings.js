var dateutils = require('date-utils');
var url = require('url');
var exec = require('child_process').exec;
var fs = require('fs');
var mdb = require('./mongo.conf');
var xml2js = require('xml2js');
var util = require('util');

var mongo_connection = "mongodb://" + mdb.mongo.username + ":" + mdb.mongo.password + "@" + mdb.mongo.url + "/" + mdb. mongo.db;
var Mongolian = require("mongolian");
var db = new Mongolian(mongo_connection);
var dailies = db.collection("dailies");

add_data = function(day, xml_data) {
    console.log("passed to add_data");
    // console.log(xml_data);
    // day should be in format YYYYMMDD
    var current = dailies.find({date: day}).count( function(err, current) {
        if (current > 0) {
            console.log("No insert, data already exists for " + day);
        } else {
            console.log("Inserting data for " + day);
              dailies.insert({date: day,  body : xml_data});
        }
    });
}

exports.list = function() {
    dailies.find().forEach(function(day) {
        console.log(day);
    });
}

exports.get_todays_standings = function() {
    console.log("Getting stats now, it's " + new Date().toCLFString())
    var standings_url="http://erikberg.com/mlb/standings.xml"
    var curl = 'curl  -L ' + standings_url;
    var yesterday=Date.yesterday()
    exec(curl, function(err, stdout, stderr) {
        if (err) throw err;
        console.log("Got stats for " + yesterday)
        console.log(stdout);
        add_data(yesterday.toFormat("YYYYMMDD"), stdout);
    });
};

exports.insert_local = function(day) {
    // insert stats from xml on the file system
    fs.readFile("/Users/mwall/src/Personal/baseball-standings/xml/"+ day + ".xml", "ascii", function(err, data) {
        if (err) throw err;
        console.log("Got data, adding to mongo for " + day);
        add_data(day, data);
    });
}

exports.get_standings_for_day = function(req, res, next) {
    dailies.findOne({date: req.params.day}, function(err, data) {
        var format = req.params.format;
        if (err) {
            console.log("Params " + util.inspect(req.params) + " threw error " + util.inspect(err));
            req.body = err.toString();
        } else if (data) {
            if (format == "json") {
                var parser = new xml2js.Parser();
                res.contentType("application/json");
                parser.parseString(data.body, function (err, result) {
                    if (err) {
                        console.log("Params " + util.inspect(req.params) + " threw error " + util.inspect(err));
                        req.body = err.toString();
                    } else {
                        req.body = result;
                     }
                });
            } else if (format == "xml") {
                res.contentType("text/xml");
                req.body = data.body;
            } else {
                req.body = "Format unknown, use .xml or .json";
            }
        } else {
            console.log("No data for day " + req.params.day);
            req.body = "Sorry, no data for " + req.params.day;
        }
        next();
    });;
}

exports.dailies = dailies;

