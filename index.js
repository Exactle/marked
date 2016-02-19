//var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
//test comment
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/profile\/*', function(request, response) {
  var cut = request.originalUrl.substring(9);
  response.render('pages/profile', {user: cut});
});

// app.get('/db', function(request,response) {
// 	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// 		client.query('SELECT * FROM test_table', function(err, result){
// 			done();
// 			if(err)
// 				{console.error(err); response.send("Error "+err);}
// 			else
// 				{response.render('pages/db', {results: result.rows});}
// 		});
// 	});
// });

app.get(/user\/*/, function(request, response) {
  if(request.originalUrl === "/user/michael")
  	response.send("u a cool guy");
  else
  	response.send("might be cool i dunno tbh");
  // response.send('/a/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});