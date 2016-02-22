var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

//Authentication tools
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var backend = require('./backend');
console.log(backend.coolfunction());
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.get(/testing\/(.*)/, function(request, response) {
	var name = request.params[0];
	backend.addUser(name);
	var friend = backend.addUser("Xander");	
	console.log(backend.getUser(name).addFriend(friend));
	response.send(backend.getUser(name).friends);	
});

app.get(/profile\/(.*)/, function (request, response) {
    var cut = request.params[0];
    //request.originalUrl.substring(9);
    response.render('pages/profile', {user: cut})
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