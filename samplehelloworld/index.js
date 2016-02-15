//by Michael
//to run: 'node index.js' in command prompt
//to stop: Ctrl+C
//to access: browse to http://localhost:3000/
//or http://localhost:3000/hello
//you should get this running first

var express = require('express');
var app = express();

app.get('/hello', function(req, res) {
  res.send('hello nerds');
});

app.get('/', function(req, res) {
  res.send('wow <b> this is cool </b>' + (Math.random()));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});