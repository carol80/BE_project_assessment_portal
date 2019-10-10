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

    app.route('/:mentors')
        .get(appRoutes.getMentors)
        .post(appRoutes.updateGroups)

    app.route('/:mentors/:grpno')
        .get(appRoutes.getgrpno)
        .post(appRoutes.updategrpno)

    app.route('/:mentors/:grpno/7term')
        .get(appRoutes.get7term)
        .post(appRoutes.update7term)
};