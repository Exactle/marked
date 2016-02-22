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

//Middleware
app.use(bodyParser());
app.use(cookieParser('ooh mysterious'));
app.use(session());

//Message middleware

app.use(function (req, res, next) {
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


// hash('shukla', function(err, salt, hash){
//     if(err) throw err;
//     // store the salt & hash in the dummy db
//     users['karan'].salt = salt;
//     users['karan'].hash = hash.toString();
// })

function authent(name, pass, fn) {
    if (!module.parent)
        console.log('bro we authenticating %s:%s', name, pass);
    if (!backend.getUser(name)) {
        return fn(new Error('User does not exist in ddb'));
    }
    var password = backend.getUser(name).password;

    //query dummydb
    // hash(pass, , function(err,hash){
    //     if(err)
    //         return fn(err);
    //     if(hash.toString() == user.hash)
    //         return fn(null,user);
    if (!(password === pass)) {

        console.log(backend.getUser(name));
        return fn(new Error('Password is invalid'));
    }
    console.log("the user is " + name + " and their password is " + password);
    return fn(null, backend.getUser(name));
}

function restrict(req, res, next) {
    if (req.session.user) {
        console.log(req.session.user);
        next();
    } else {
        req.session.error = 'ACCESS DENIED';
        res.redirect('/login');
    }
}

app.get('/', function (req, res) {
    res.redirect('login');
});

app.get('/restricted', restrict, function (req, res) {
    res.send('Restricted location, please click to <a href="/logout">logout</a>');
});

app.get('/logout', function (req, res) {
    //End user session
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/login', function (req, res) {
    console.log(req.connection.remoteAddress);
    res.render('login');
});

app.get('/signup', function (req, res) {
    console.log(req.connection.remoteAddress);
    res.render('signup');
});

app.post('/login', function (req, res) {
    authent(req.body.username, req.body.password, function (err, user) {
        if (user) {
        console.log("the supposed user's name is " + user.name);

            console.log('authenticate');
            req.session.regenerate(function () {
                // Store username as session user
                req.session.user = user;
                req.session.success = 'Authenticated as ' + req.body.username;
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            console.log('Authentication failed');
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "karan" and "shukla")';
            res.redirect('login');
        }
    });
});

app.post('/signup', function (req, res) {
    addUser(req.body.username, req.body.password);
    console.log('user added');
    authent(req.body.username, req.body.password, function (err, user) {
        if (user) {
            console.log('authenticate');
            req.session.regenerate(function () {
                //Store session user as user/display username
                req.session.user = user;
                req.session.success = 'Authenticated as ' + req.body.username
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            console.log('Authentication failed');
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "karan" and "shukla")';
            res.redirect('login');
        }
    });
});

//Adduser function for signup
function addUser(usr, pss) {
    if (backend.getUser(usr)) {
        console.log("USER ALREADY EXISTS");
    }
    else {
        console.log("123 " + pss);
        backend.addUser(usr, pss);

        // hash(pss, function(err, salt, hash){
        // if (err) throw err;
        // // store the salt & hash in the "db"
        // users.usr.salt = salt;
        // users.usr.hash = hash.toString();
    }
}


/*////////////////////
 /
 /DUMMY LOGIN DATABASE END
 / TODO: Replace with real database (DevelopAlexKaran has real MongoLAB setup)
 */////////////////////

//backend

var backend = require('./backend');
//console.log(backend.coolfunction());

// views is directory for all template files
//config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('login');
});

app.get(/testing\/(.*)/, function(request, response) {
	var name = request.params[0];
	
	console.log("\n");
	backend.addUser(name);
	var friend = backend.addUser("Xander");	
	backend.getUser(name).addFriend(friend);
	console.log("\nFriend added!");
	console.log(backend.getUser(name).getFriend(friend.name));
	
	backend.getUser(name).addGroup("SE Buddies");		
	backend.getUser(name).getGroup("SE Buddies").addMember(friend);
	console.log("\nGroup created!")
	console.log(backend.getUser(name).getGroup("SE Buddies"));
	
	backend.getUser(name).addMark("Mark", name, "THIS IS URL", "secret privacy");
	console.log("\nMark created!");
	console.log(backend.getUser(name).getMark("Mark"));
	
	backend.getUser(name).addTag("Test tag");
	backend.getUser(name).getTag("Test tag").addMark(backend.getUser(name).getMark("Mark"));
	backend.getUser(name).getMark("Mark").addTag("Test tag");
	console.log("\nTag added!");
	console.log(backend.getUser(name).getTag("Test tag").getMark("Mark"));
	
	response.send(name + " user created! Please see console for further output.");
});

app.get(/testMarks\/(.*)/, function(request, response) {
	var name = request.params[0];
	var owner = "Sterling";
	var url = "www.google.com";
	var privacy = 0;
	backend.addMark(name, owner, url, privacy);
	response.send("worked so far. lets try printing to console!");
	//backend.mark.displayMark();
});

app.get(/\/profile\/(.*)/, function (request, response) {
    var name = request.params[0];


    backend.addUser(name);
    var user = backend.getUser(name);
    backend.addUser("john doe")
    backend.addUser("jane doe")
    user.addFriend(backend.getUser("john doe"));
    user.addFriend(backend.getUser("jane doe"));


    //if(user.name = request.session.user) {

    console.log("the user is: " + request.session.user);

    if (request.session.user === name) {
        response.render('pages/ownProfile', {user: user});
    }
    else {

        //     for (friend of user.friends
        // )
        //     {
        //         console.log("this is a friend: " + friend.name);
        //     }
        response.render('pages/profile', {user: user});
    }

});

app.get('/test', function (request, response) {
    console.log("test");
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

app.get('/addMark/:name/:url', function(request, response) {
    var name = request.params.name;
    var url = request.params.url;
    console.log("the name is " + name);
    console.log("the url is " + url);

    var user = request.session.user;
    console.log(user);

    console.log("the user is " + user.name);
    backend.getUser(user.name).addMark(name, user, url, null); //I DON'T KNOW WHY THIS WORKS but user.addMark(...) doesn't
    // user.addFriend(null);
    // user.addMark(name, user, url, null);
    response.send("done");
});

// app.post(/.*/, function (request, response) {
//     console.log("thing is:" + request.originalUrl);
// });

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
    // addUser('karan', 'shukla');
});

app.get('/pages/newmark', function (request, response) {
    response.send("time to ask for help");
});
