/* nodejs navigation codes */

/*Libraries*/
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const request = require("request");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
// ---------------static page----------------
// const dir = path.join(__dirname,'../public')
// app.use(express.static(dir))

// path
const viewpath = path.join(__dirname, "../pages/views");
const partialpath = path.join(__dirname, "../pages/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);

//may be its wrong!!So dont use it
// var connect = 'postgres://be_portal:123456@localhost/be_portal'



//====== functions =======//


    //-------- promises method -------//
    // function execute() {
    // client.connect()
    //     .then(() => console.log("connected SUCCESSFULLY!!"))
    //     // .then(() => client.query("insert into students values($1, $2)", [26, 'Raymond']))
    //     .then(() => client.query("select * from groups"))
    //         .then(result => res.render("index", { 
    //             students: result.rows
    //          }))
    //         .catch(err => console.log("error running the query", err))
    //     .catch(e => console.log("error fetching the client from the pool", e))
    // .finally(() => client.end())
    // }





// Navigator
app.get('/' ,(req, res) => {   
    var str = "select * from groups";

    execute(str)
        //------- callback method -------//
    async function execute(str) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            // var client = new Client({
            //     user : "postgres",
            //     password : "Prince@99",
            //     host : "localhost",
            //     port : 5432,
            //     database : "postgres"
            // });

            //Database: Carol
            var client = new Client({
                user: "be_portal",
                password: "123456",
                host: "localhost",
                port: 5432,
                database: "be_portal"
            })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str)
            console.table(rows)
            res.render("index", {
                rows,
                listExists: true
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    }
})
var urlencodedParser = app.use(bodyParser.urlencoded({
    extended: true,
}))

app.post("/", (req, res) => {
    str = "insert into groups (rno,rno1,rno2,title,mentor_name) values($1, $2, $3, $4, $5)";
    values = [parseInt(req.body.g_m_1),parseInt(req.body.g_m_2),parseInt(req.body.g_m_3),req.body.title,req.body.gpmn];
    // values = [parseInt(req.body.g_id), parseInt(req.body.g_m_1), parseInt(req.body.g_m_2), parseInt(req.body.g_m_3), req.body.title, req.body.gpmn];
        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            // var client = new Client({
            //     user : "postgres",
            //     password : "Prince@99",
            //     host : "localhost",
            //     port : 5432,
            //     database : "postgres"
            // });


            //Database: Carol
            var client = new Client({
                user: "be_portal",
                password: "123456",
                host: "localhost",
                port: 5432,
                database: "be_portal"
            })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.render("index", {
                rows,
                listExists: true
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end()
            console.log("Client disconnected successfully.")    ;
        }
    }
    executed(str, values);
})

app.get('/:mentors',(req,res)=>{
    var str = "select * from groups where mentor_name=$1";
    values=[req.params.mentors]
    execute(str,values)
        //------- callback method -------//
    async function execute(str,values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            // var client = new Client({
            //     user : "postgres",
            //     password : "Prince@99",
            //     host : "localhost",
            //     port : 5432,
            //     database : "postgres"
            // });

            //Database: Carol
            var client = new Client({
                user: "be_portal",
                password: "123456",
                host: "localhost",
                port: 5432,
                database: "be_portal"
            })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.table(rows)
            res.render("teacher", {
                rows,
                listExists: true,
                teacher : req.params.mentors
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    }
});

app.post("/mentors", (req, res) => {
    strteacher = 'kalpana'
    str = "update groups set title= $1 where mentor_name= $2 and rno= $3 ";
    values = [req.body.title,strteacher,parseInt(req.body.leader_rno)];
    
        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            // var client = new Client({
            //     user : "postgres",
            //     password : "Prince@99",
            //     host : "localhost",
            //     port : 5432,
            //     database : "postgres"
            // });


            //Database: Carol
            var client = new Client({
                user: "be_portal",
                password: "123456",
                host: "localhost",
                port: 5432,
                database: "be_portal"
            })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.render("group_details", {
                rows,
                listExists: true
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end()
            console.log("Client disconnected successfully.")    ;
        }
    }
    executed(str, values);
});

app.get('/mentors/:grpno',(req,res)=>{
    var str = "select ";
    grpno = req.params.grpno;
    execute(str)
        //------- callback method -------//
    async function execute(str) {
        try{
            res.render("group_details", {
                teacher : 'kalpana',
                grpno : grpno
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    }
});


app.post("/mentors/grpno", (req, res) => {
    strteacher = 'kalpana'
    str = "update groups set title= $1 where mentor_name= $2 and rno= $3 ";
    values = [req.body.title,strteacher,parseInt(req.body.leader_rno)];
    // values = [parseInt(req.body.g_id), parseInt(req.body.g_m_1), parseInt(req.body.g_m_2), parseInt(req.body.g_m_3), req.body.title, req.body.gpmn];
    // console.log("Hello");
        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            // var client = new Client({
            //     user : "postgres",
            //     password : "Prince@99",
            //     host : "localhost",
            //     port : 5432,
            //     database : "postgres"
            // });


            //Database: Carol
            var client = new Client({
                user: "be_portal",
                password: "123456",
                host: "localhost",
                port: 5432,
                database: "be_portal"
            })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.render("teacher", {
                rows,
                listExists: true
            });
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end()
            console.log("Client disconnected successfully.")    ;
        }
    }
    executed(str, values);
});

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


// Listening port
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})