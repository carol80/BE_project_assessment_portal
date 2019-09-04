/* nodejs navigation codes */

/*Libraries*/
const path = require("path")
const hbs = require("hbs")
const express = require("express")
const request = require("request")
const { Client } = require("pg")
const bodyParser = require("body-parser")
const app = express()


// ---------------static page----------------
// const dir = path.join(__dirname,'../public')
// app.use(express.static(dir))

// path
const viewpath = path.join(__dirname, "../pages/views")
const partialpath = path.join(__dirname, "../pages/partials")
app.set("view engine", "hbs")
app.set("views", viewpath)
hbs.registerPartials(partialpath)

//may be its wrong!!So dont use it
// var connect = 'postgres://be_portal:123456@localhost/be_portal'



//====== functions =======//


    //-------- promises method -------//
    // function execute() {
    // client.connect()
    //     .then(() => console.log("connected SUCCESSFULLY!!"))
    //     // .then(() => client.query("insert into students values($1, $2)", [26, 'Raymond']))
    //     .then(() => client.query("select * from Students"))
    //         .then(result => res.render("index", { 
    //             students: result.rows
    //          }))
    //         .catch(err => console.log("error running the query", err))
    //     .catch(e => console.log("error fetching the client from the pool", e))
    // .finally(() => client.end())
    // }





// Navigator
app.get('/' ,(req, res) => {   
    var str = "select * from students"

    execute(str)
        //------- callback method -------//
    async function execute(str) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
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
            console.log(rows)
            res.render("index", {
                rows,
                listExists: true
            })
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`)
        }
        finally 
        {
            await client.end()
            console.log("Client disconnected successfully.")    
        }
    }
})

var urlencodedParser = app.use(bodyParser.urlencoded({
    extended: false
}))

app.post("/groups", urlencodedParser, (req, res) => {
    str = "insert into groups(g_m_1, g_m_2, g_m_3, title) values($1, $2, $3, $4)"
    values = [req.body.g_m_1, req.body.g_m_2, req.body.g_m_3, req.body.title]
    execute(str, values)
        //------- callback method -------//
    async function execute(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
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
            })
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`)
        }
        finally 
        {
            await client.end()
            console.log("Client disconnected successfully.")    
        }
    }
})

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