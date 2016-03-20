var express = require('express');
var hash = require('./pass').hash
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express();

var backend = require('./backend');
//e.g. console.log(backend.coolfunction());

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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

app.get('/', function (req, res) {
    res.redirect('signup');
});

app.get('/restricted', restrict, function (req, res) {
    res.send('Restricted location, please click to <a href="/logout">logout</a>');
});

app.get('/logout', function (req, res) {
    //End user session
    req.session.destroy(function () {
        res.redirect('/login');
    });
});

app.get('/login', function (req, res) {
    console.log(req.connection.remoteAddress);
    res.render('login');
});

app.post('/login', function (req, res) {
    console.log('thats an authent');
    authent(req.body.username, req.body.password, function (err, user) {
        if (user) {
            console.log("the supposed user's name is " + user.name);

            console.log('authenticate');
            req.session.regenerate(function () {
                // Store username as session user
                req.session.user = user;
                req.session.success = 'Authenticated as ' + req.body.username;
                +' click to <a href="/logout">logout</a>. '
                + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/profile/' + user.name);
            });
        } else {
            console.log('Authentication failed');
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('login');
        }
    });
});

app.get('/signup', function (req, res) {
    console.log(req.connection.remoteAddress);
    res.render('signup');
});

app.post('/signup', function (req, res) {
    addUser(req.body.username, req.body.password);
    console.log('user added');
    console.log('thats another authent');
    authent(req.body.username, req.body.password, function (err, user) {
        if (user) {
            console.log('authenticate');
            req.session.regenerate(function () {
                //Store session user as user/display username
                req.session.user = user;
                req.session.success = 'Authenticated as ' + req.body.username
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/profile/' + user.name);
            });
        } else {
            console.log('Authentication failed');
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('login');
        }
    });
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

app.get('/', function (req, res) {
    res.render('login');
});

app.get(/\/profile\/(.*)/, function (req, res) {
    var name = req.params[0];
    var user = backend.getUser(name);

    //if(user.name = req.session.user) {

    if (user) {

        backend.addUser("john doe");
        backend.addUser("jane doe");
        user.addFriend(backend.getUser("john doe"));
        user.addFriend(backend.getUser("jane doe"));

        if (req.session.user) {
            console.log("the user is: " + req.session.user.name);

            if (req.session.user.name === name) {
                res.render('pages/ownProfile', {user: user});
            }
        }
        else {

            //     for (friend of user.friends)
            //     {
            //         console.log("this is a friend: " + friend.name);
            //     }
            res.render('pages/profile', {user: user});
        }
    }
    else {
        res.send("User '" + name + "' doesn't exist!");
    }

});

app.get('/makeMark', function (req, res) {
    res.render('pages/makeMark');
});

app.post('/makeMark', function (req, res) {
    var name = req.body.name;
    var url = req.body.url;
    console.log("the name is " + name);
    console.log("the url is " + url);

    var user = req.session.user;
    console.log(user);
    console.log(user.constructor);

    console.log("the user is " + user.name);
    if(backend.getUser(user.name) !== user)
        console.log("its super borked"); //I am trying to figure this bug out rn - Milo
    backend.getUser(user.name).addMark(name, user, url, null); //I DON'T KNOW WHY THIS WORKS but user.addMark(...) doesn't
    // user.addFriend(null);
    // user.addMark(name, user, url, null);
    res.redirect('/profile/' + user.name);
});

///TESTING AND EXAMPLES
///BELOW THIS LINE

app.get(/testing\/(.*)/, function (req, res) {
    var name = req.params[0];

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
    var mark1 = backend.getUser(name).getMark("Mark");
    backend.getUser(name).getTag("Test tag").addMark(mark1);
    backend.getUser(name).getMark("Mark").addTag("Test tag");
    console.log("\nTag added!");
    console.log(backend.getUser(name).getTag("Test tag").getMark("Mark"));

    res.send(name + ' group created! Please see console for further output. <br> <br> Check these out! <br> <a href="/profile/Xander">User1</a> <br> <a href="/profile/' + name + '">User2</a>');
});

app.post(/testMarks\/(.*)/, function (req, res) {
    var name = req.params[0];
    var owner = "Sterling";
    var url = "www.google.com";
    var privacy = 0;
    backend.addMark(name, owner, url, privacy);
    res.send("worked so far. lets try printing to console!");
    //backend.mark.displayMark();
});

app.get('/test', function (req, res) {
    console.log("test");
    res.send('<a href="/link"> Go to that cool page</a>');
});

app.get('/link', function (req, res) {
    res.send('Tada! You went to that page');
});

// app.get('/db', function(req,res) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//      client.query('SELECT * FROM test_table', function(err, result){
//          done();
//          if(err)
//              {console.error(err); res.send("Error "+err);}
//          else
//              {res.render('pages/db', {results: result.rows});}
//      });
//  });
// });


// app.get('/addMark/:name/:url', function(req, res) {
//     var name = req.params.name;
//     var url = req.params.url;
//     console.log("the name is " + name);
//     console.log("the url is " + url);

//     var user = req.session.user;
//     console.log(user);

//     console.log("the user is " + user.name);
//     backend.getUser(user.name).addMark(name, user, url, null); //I DON'T KNOW WHY THIS WORKS but user.addMark(...) doesn't
//     // user.addFriend(null);
//     // user.addMark(name, user, url, null);
//     res.send("done");
// });

// app.post(/.*/, function (req, res) {
//     console.log("thing is:" + req.originalUrl);
// });

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});