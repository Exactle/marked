var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
//test comment
app.set('port', (process.env.PORT || 5000));

//Authentication tools
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js')

//Connect to DB
mongoose.connect(configDB);
 require('./config/passport')(passport); //pass passport for configuration


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
	response.send(cool());
});

app.get('/db', function(request,response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result){
			done();
			if(err)
				{console.error(err); response.send("Error "+err);}
			else
				{response.render('pages/db', {results: result.rows});}
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

