var static = require('node-static');
var standings = require('./standings.js');
var cronJob = require('cron').CronJob;

var os = require("os");
var hostname = os.hostname();
var port = 80;
if (hostname == "localhost") {
    port = 8080;
}

// load today's stats into mongo
cronJob('00 00 7 * * *', function(){
    console.log("Cron triggered, trying to get standings for today");
    standings.get_todays_standings();
});

//standings.insert_20120404();

var file = new(static.Server)();

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(port);
console.log("Started service on " + hostname + ":" + port);

