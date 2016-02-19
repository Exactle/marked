var express = require('express');
var app = express();
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

//Connect to DB
mongoose.connect('  mongodb://gangjute8:Turtle1212!@ds011268.mongolab.com:11268/markeddb');
 require('./config/passport')(passport); //pass passport for configuration


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
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


