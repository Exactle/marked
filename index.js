var express = require('express');
var hash = require('./pass').hash
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express();

app.set('port', (process.env.PORT || 5000));

//Authentication tools
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

//middleware
app.use(bodyParser());
app.use(cookieParser('ooh mysterious'));
app.use(session());

//message middleware

app.use(function(req, res, next){ 
    var err = req.session.error 
    , msg = req.session.success;
    delete req.session.error; 
    delete req.session.success; 
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>'; 
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>'; 
    next(); 
}); 

/*////////////////////
/
/DUMMY LOGIN DATABASE START
/ TODO: Replace with real database (DevelopAlexKaran has real MongoLAB setup)
*/////////////////////

var users = {};

users['karan'] = 'shukla';

// hash('shukla', function(err, salt, hash){
//     if(err) throw err;
//     // store the salt & hash in the dummy db
//     users['karan'].salt = salt;
//     users['karan'].hash = hash.toString();
// })

function authent(name, pass, fn){
    if(!module.parent)
        console.log('bro we authenticating %s:%s', name, pass);
    if(!(name in users))
        return fn(new Error('User does not exist in ddb'));
    var user = users[name];

    //query dummydb
    // hash(pass, , function(err,hash){
    //     if(err)
    //         return fn(err);
    //     if(hash.toString() == user.hash)
    //         return fn(null,user);
    if(!(users[name] === pass))
       return fn(new Error('Password is invalid'));
    return fn(null,user);
}

function restrict(req, res, next){
    if(req.session.user){
        next();
    } else{
        req.session.error = 'ACCESS DENIED';
        res.rederict('/login');
    }
}

app.get('/', function(req,res){
    res.redirect('login');
});

app.get('/restricted', restrict, function(req, res){
    res.send('Restricted location, please click to <a href="/logout">logout</a>');
})

app.get('/logout', function(req, res){
    // destroy the user's session to log them out 
    // will be re-created next request
    req.session.destroy(function(){ 
        res.redirect('/');
    }); 
}); 

app.get('/login', function(req, res){ 
    console.log(req.connection.remoteAddress);
    res.render('login');
}); 

app.get('/signup', function(req, res){ 
    console.log(req.connection.remoteAddress);
    res.render('signup');
}); 

app.post('/login', function(req, res){
    authent(req.body.username, req.body.password, function(err, user){ 
    if (user) { 

        console.log('authenticate')
        // Regenerate session when signing in 
        // to prevent fixation
        req.session.regenerate(function(){
            // Store the user's primary key 
            // in the session store to be retrieved,
            // or in this case the entire user object 
            req.session.user = user;
            req.session.success = 'Authenticated as ' + req.body.username 
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/restricted">/restricted</a>.'; 
            res.redirect('back'); 
        }); 
    } else {
            console.log('Authentication failed')
        req.session.error = 'Authentication failed, please check your ' 
        + ' username and password.' 
        + ' (use "karan" and "shukla")'; 
        res.redirect('login');
    } 
    }); 
}); 

app.post('/signup', function(req, res){
    addUser(req.body.username, req.body.password);
    console.log('user added')
    authent(req.body.username, req.body.password, function(err, user){ 
    if (user) { 
        console.log('authenticate')
        // Regenerate session when signing in 
        // to prevent fixation
        req.session.regenerate(function(){
            // Store the user's primary key 
            // in the session store to be retrieved,
            // or in this case the entire user object 
            req.session.user = user;
            req.session.success = 'Authenticated as ' + req.body.username 
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/restricted">/restricted</a>.'; 
            res.redirect('back'); 
        }); 
    } else {
            console.log('Authentication failed')
        req.session.error = 'Authentication failed, please check your ' 
        + ' username and password.' 
        + ' (use "karan" and "shukla")'; 
        res.redirect('login');
    } 
    }); 
}); 

function addUser(usr, pss)
{
    if(usr in users)
        {console.log("USER ALREADY EXISTS")
        }
    else{
    users[usr] = pss;

    // hash(pss, function(err, salt, hash){ 
    // if (err) throw err; 
    // // store the salt & hash in the "db"
    // users.usr.salt = salt; 
    // users.usr.hash = hash.toString();
    } 
}


app.listen(5000); 
console.log('Express started on port ' + 5000);

/*////////////////////
/
/DUMMY LOGIN DATABASE END
/ TODO: Replace with real database (DevelopAlexKaran has real MongoLAB setup)
*/////////////////////

//backend

var backend = require('./backend');
console.log(backend.coolfunction());

// views is directory for all template files
//config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('login');
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