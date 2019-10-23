/* ========================================================== 
                        Libraries
============================================================ */
const express = require("express");
const request = require("request");
const path = require("path");
const hbs = require("hbs");
var logger   = require('morgan');								//logger middleware
const bodyParser = require("body-parser");
const http = require("http");
const session = require('express-session');
var cookieParser = require('cookie-parser');
hbs.registerHelper("equal", require("handlebars-helper-equal"))
const User = require('./models/user');
const app = express()

/*================================================================
                    Path Declarations
=================================================================*/
const viewpath = path.join(__dirname, "./public/views");
const partialpath = path.join(__dirname, "./public/views/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);

/* ========================================================== 
            Internal App Modules/Packages Required
============================================================ */
var Admin = require('./server/Admin.js');                       //Exchange routes & DB Queries
var Mentor = require('./server/Mentor.js');						//Exchange routes & DB Queries 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
/* ========================================================== 
                     Middleware
============================================================ */
app.use(logger('dev')); 	//log every request to the console


/* ========================================================== 
            parsing through the incoming data
============================================================ */
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public')))

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
// {issues to b fixed here!!}
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        if (this.role === "Admin") {
            res.redirect('admin', Admi(app));
            console.log("inside Admin");
        } else if (this.role === "Mentor"){
            res.redirect('/'+this.username , Mentor(app));
            console.log("Inside Mentor")
        }
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render("signup");
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            role: req.body.role,
            email: req.body.email,
            password: req.body.password
        })
        .then(async (user) => {
            req.session.user = user.dataValues;
                if (await user.roles() === "Admin") {
                    res.render('admin', Admin(app));
                    console.log("inside Admin");
                } else if (await user.roles() === "Mentor"){
                    res.redirect('/'+ username , Mentor(app));
                    console.log("Inside Mentor")
                }
        })
        .catch(error => {
            res.render('signup');
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login')
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
        User.findOne({ where: { username: username } }).then(async function (user) {
            if (!user) {
                res.render('/login');
            } else if (!await user.validPassword(password)) {
                res.render('/login');
            } else {
                req.session.user = user.dataValues;
                // var role = await client.query("select role from users where username= $1",[username])
                // console.log("dashboard")
                if (await user.roles() === "Admin") {
                    res.render('admin', Admin(app));
                    Admin(app);
                    console.log("inside Admin");
                } else if (await user.roles() === "Mentor"){
                    res.render("mentor", {
                        teacher : username
                    });
                    Mentor(app);
                    console.log("Inside Mentor")
                }
            }
        });
    });



/* ========================================================== 
                    ROUTES - for Express
============================================================ */

// route for Admin's dashboard
Admin(app);
// app.get('/index', (req, res) => {
//     if (req.session.user && req.cookies.user_sid) {
//         // res.sendFile(__dirname + '/public/dashboard.html');
//         res.render("index");
//     } else {
//         res.redirect('/login');
//     }
// });

// route for Mentor's dashboard
Mentor(app);
// app.get('/teacher', (req, res) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.render("teacher");
//     } else {
//         res.redirect('/login');
//     }
// });


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


/* ========================================================== 
                    Listening port
============================================================ */
var server = http.createServer(app);
server.listen(3000, () => {
    console.log('Server is up on port 3000')
})