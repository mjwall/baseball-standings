# Baseball Standings

## Background
In 2011, the Balitmore Orioles started off at 6-1 and were in first place in the NL East.  But by they All Star break, they were 36-52 and finished the season at 69-93.  I wanted a graphic I could look at to see some success.  This page is close, http://www.baseball-reference.com/teams/BAL/2011.shtml.  What I wanted though was a chart of games behind over the entire season.

I also wanted to play with node.js some more, and received a beta account to http://nodejitsu.com.  I have had an account on http://no.de for some time and one for http://nodester.com.  Both are great services, but I never really did anything with them beyond proving I could deploy something.  Nodejitus includes databases as well, and I wanted to learn some MongoDB.

## Design
So like most things, data is key here.  I need stats for games behind for each time every day of the season.  I searched through all the usual sources and didn't find anything.  The closest I came was http://erikberg.com/mlb/standings.xml, but that is for the current day.  I needed to grab that data everyday and store it somewhere.  I decided to shove the xml into Mongo.  Using node-cron, I can run a job every morning to do that.  The next steps are to come up with a json respresentation of the data I want and then create graphs for each division.

## Development
If you want try this app yourself, you will need to copy the mongo.conf.sample to mongo.conf and fill it in with your MongoDB configuration info.

## Deployment
This app is current deployed to http://baseball-standings.jit.su.  Nothing exciting yet, just gathering data in the background for a while until I get time to make it informative.

