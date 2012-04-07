// load today's stats into mongo with a cron
var standings = require('./standings.js');
var cronJob = require('cron').CronJob;
cronJob('00 00 11 * * *', function(){
    // looks like server is 4 hours ahead
    console.log("Cron triggered, trying to get standings for today");
    standings.get_todays_standings();
});
//standings.insert_20120404();


// express stuff
var express = require('express');
var app = express.createServer();
var pub = __dirname + '/../public';
app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler({ dump: true, stack: true }));

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/xml/:day', standings.get_xml_for_day, function(req, res){
  res.send(req.xml);
});


// setup port and start app
var os = require("os");
var hostname = os.hostname();
var port = 80;
if (hostname == "localhost") {
    port = 8080;
}
app.listen(port);
console.log("Started service on " + hostname + ":" + port);

