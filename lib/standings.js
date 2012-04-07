var dateutils = require('date-utils');
var url = require('url');
var exec = require('child_process').exec;
var fs = require('fs');
var mdb = require('./mongo.conf.js');

var mongo_connection = "mongodb://" + mdb.mongo.username + ":" + mdb.mongo.password + "@" + mdb.mongo.url + "/" + mdb. mongo.db;
var Mongolian = require("mongolian");
var db = new Mongolian(mongo_connection);
var dailies = db.collection("dailies");

add_data = function(day, xml_data) {
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
        add_data(yesterday.toFormat("YYYYMMDD"), stdout);
    });
};

exports.insert_20120404 = function() {
    // needed to load yesterdays stats, which I saved on my harddrive
    var day="20120404";
    fs.readFile("/Users/mwall/src/Personal/baseball-standings/xml/20120404.xml", "ascii", function(err, data) {
        if (err) throw err;
        console.log("Got data, adding to mongo for 20120404");
        add_data(day, data);
    });
}

exports.dailies = dailies;

