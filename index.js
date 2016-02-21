var express = require('express');
var app = express();
var pg = require('pg');
// var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
console.log("wat");
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

function user(firstName) {
    this.firstName = firstName;

    this.friends = [];
    this.addFriend = function (name) {
        this.friends[this.friends.length] = name;
    };
}

app.get('/', function (request, response) {
    response.render('pages/index');

    console.log("Cookies: ", request.cookies);
});

app.get('/profile\/(*)', function (request, response) {
    var cut = request.params[0];
    //request.originalUrl.substring(9);
    response.render('pages/profile', {user: cut})
});

app.get('/user', function (request, response) {
    var krystal = new user("Krystal");
    krystal.addFriend("Mike");
    krystal.addFriend("Alex");
    krystal.addFriend("Shelby");

    var string = "Created user: ";
    string = string.concat(krystal.firstName);
    string = string.concat("<br>");

    for (i = 0; i < krystal.friends.length; i++) {
        string = string.concat("Added friend: ");
        string = string.concat(krystal.friends[i]);
        string = string.concat("<br>");
    }

    var xander = new user("Xander");
    xander.addFriend("Sterling");
    xander.addFriend("Caleb");
    xander.addFriend("Ryan");

    string = string.concat("<br>Created user: ");
    string = string.concat(xander.firstName);
    string = string.concat("<br>");

    for (i = 0; i < xander.friends.length; i++) {
        string = string.concat("Added friend: ");
        string = string.concat(xander.friends[i]);
        string = string.concat("<br>");
    }

    response.send(string);
});

app.get('/test', function (request, response) {
    response.send('<a href="/link"> Go to that cool page</a>');
});

app.get('/link', function (request, response) {
    response.send('Tada! You went to that page');
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

app.get(/user\/*/, function (request, response) {
    if (request.originalUrl === "/user/michael")
        response.send("u a cool guy");
    else
        response.send("might be cool i dunno tbh");
    // response.send('/a/');
});

app.post(/.*/, function(request, response) {
	console.log("thing is:" + request.originalUrl);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});