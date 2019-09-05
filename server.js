/* ========================================================== 
                        Libraries
============================================================ */
const express = require("express");
const request = require("request");
const path = require("path");
const hbs = require("hbs");
var logger   = require('morgan');								//logger middleware
const bodyParser = require("body-parser");
const http = require("http")
const app = express()

/*================================================================
                    Path Declarations
=================================================================*/
const viewpath = path.join(__dirname, "./pages/views");
const partialpath = path.join(__dirname, "./pages/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);

/* ========================================================== 
            Internal App Modules/Packages Required
============================================================ */
var routes = require('./server/routes.js');						//Exchange routes & DB Queries 

/* ========================================================== 
                    Use Middleware
============================================================ */
app.use(logger('dev')); 	//log every request to the console

/* ========================================================== 
                    ROUTES - for Express
============================================================ */
routes(app);

/* ========================================================== 
                    Other Stupid Pages
============================================================ */
app.get('/7-sem' ,(req, res) => {
    res.render("7-sem",{
        title: "7-sem assessment Page"
    })
})

app.get('/8-sem' ,(req, res) => {
    res.render("8-sem",{
        title: "8-sem assessment Page!"
    })
})

app.get('final', (req ,res) => {
    res.render("final",{
        title: "Final assessment Page"
    })
})



/* ========================================================== 
                    Listening port
============================================================ */
var server = http.createServer(app);
server.listen(3000, () => {
    console.log('Server is up on port 3000')
})