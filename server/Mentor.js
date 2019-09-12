/*================================================================
                    Server side Routing
                    Route Declarations
=================================================================*/

/* ========================================================== 
                    Internal App Modules
============================================================ */
var appRoutes = require('./routes/approutes.js');	//Exchange routes
const path = require("path");
const hbs = require("hbs");
const express = require("express")
const app = express()

/*================================================================
                    Path Declarations
=================================================================*/
const viewpath = path.join(__dirname, "../../public/views");
const partialpath = path.join(__dirname, "../../public/views/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);

module.exports = function(app) {

	/*================================================================
	                            ROUTES
    =================================================================*/

    app.route('teacher')
        .get(appRoutes.getMentors)
        .post(appRoutes.updateGroups)

};