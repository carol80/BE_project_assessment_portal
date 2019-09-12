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

    app.route('/')
        .get(appRoutes.showGroups)
        .post(appRoutes.insertGroups)


	// app.post('/', appRoutes.insertGroups);
    // app.get('/', appRoutes.showGroups);
    // app.get('/:mentors', appRoutes.getMentors);
    // app.post('/:mentors', appRoutes.updateGroups);
	// app.put('/api/todos/:todo_id', appRoutes.updateTodo);
	// app.delete('/api/todos/:todo_id', appRoutes.deleteTodo);
};