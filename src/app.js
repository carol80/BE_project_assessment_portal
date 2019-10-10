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
const viewpath = path.join(__dirname, "../public/views");
const partialpath = path.join(__dirname, "../public/views/partials");
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
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

            //Database: Jason
            /* var client = new Client({
                user: "forms",
                password: "",
                host: "localhost",
                port: 63034,
                database: "forms"
            }); */

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str)
            console.table(rows)
            res.render("index", {
                rows,
                listExists: true,
                Admin: 'raju'
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
    str = "insert into groups (rno,rno1,rno2,title,mentor_name) values ($1, $2, $3, $4, $5)";
    values = [parseInt(req.body.g_m_1),parseInt(req.body.g_m_2),parseInt(req.body.g_m_3),req.body.title,req.body.gpmn];
    // values = [parseInt(req.body.g_id), parseInt(req.body.g_m_1), parseInt(req.body.g_m_2), parseInt(req.body.g_m_3), req.body.title, req.body.gpmn];

    executed(str, values);

        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.redirect('/');
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
    };
})

app.get('/:mentors',(req,res)=>{
    var str = "select * from groups where mentor_name=$1";
    values=[req.params.mentors]
    
        //------- callback method -------//
    async function execute(str,values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

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
    execute(str,values)
});

app.post("/:mentors", (req, res) => {
    strteacher = req.params.mentors
    str = "update groups set title= $1 where mentor_name= $2 and rno= $3 ";
    values = [req.body.title,strteacher,parseInt(req.body.leader_rno)];

        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });


            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values);
            console.table(rows);
            res.redirect(`/${strteacher}`);
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

app.get('/:mentors/:grpno',(req,res)=>{
    grpno = req.params.grpno;
    teacher = req.params.mentors;
        //------- callback method -------//
        try{
            res.render("group_details", {
                teacher : teacher,
                grpno : grpno
            }); 
        }
        catch (ex)
        {
            console.log(`Something wrong happend ${ex}`);
        }
        finally 
        {
            console.log("Client disconnected successfully.")  ;  
        }
});


app.post("/:mentors/:grpno", (req, res) => {
    teacher = req.params.mentors
    grpno = req.params.grpno
    str = "update groups set title= $1 where mentor_name= $2 and rno= $3 ";
    values = [req.body.title,teacher,parseInt(req.params.grpno)];
    // values = [parseInt(req.body.g_id), parseInt(req.body.g_m_1), parseInt(req.body.g_m_2), parseInt(req.body.g_m_3), req.body.title, req.body.gpmn];
    // console.log("Hello");
        //------- callback method -------//
    async function executed(str, values) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });


            //Database: Carol
            /* var client = new Client({
               user: "be_portal",
               password: "123456",
               host: "localhost",
               port: 5432,
               database: "be_portal"
            }) */

            //Database: Jason //Implement Database
            /* var client = new Client({
                user: "forms",
                password: "",
                host: "localhost",
                port: 63034,
                database: "forms"
            }); */

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.render("group_details", {
                rows,
                grpno : grpno,
                teacher : teacher,
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

app.get('/:mentors/:grpno/7term' ,(req, res) => {   //Written by Jason, pending Testing
    teacher = req.params.mentors
    grpno = req.params.grpno
    
    values = [teacher,parseInt(grpno)]

    var str = "select * from t7form where mentor=$1 and rollno1=$2";

    execute(str)
        //------- callback method -------//
    async function execute(str) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.table(rows)
            res.render("7term",{
                title: "7-term assessment Page",
                grpno : grpno,
                teacher : teacher,
                rows : rows,
                listExists : true
            })
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

app.post('/:mentors/:grpno/7term' ,(req, res) => {  //Written by Jason, pending Testing
    teacher = req.params.mentors
    grpno = req.params.grpno
    
    str2 = "select rno1,rno2 from groups where rno=$1";
    values2 =[grpno];
    
    str1 = "insert into t7form (rollno1,rollno2,rollno3,co1_1,co2_1,co1_2,co2_2,co1_3,co2_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)";
    values1 = [grpno,parseInt(req.body.rollno2),parseInt(req.body.rollno3),parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co1_3),parseInt(req.body.co2_3),teacher];

    executed(str1,values1,str2,values2);

        //------- callback method -------//
    async function executed(str1,values1,str2,values2) {
        try{

            //======== connecting to Postgresql database ========//(inside the func. to avoid the reuse of client)
            //Database: Princeton(put my database-codes in comments when you r using yours)
            var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            //Database: Carol
            // var client = new Client({
            //     user: "be_portal",
            //     password: "123456",
            //     host: "localhost",
            //     port: 5432,
            //     database: "be_portal"
            // })

            await client.connect()
            console.log("Connected successfully.")

            const {rows1} = await client.query(str2,values2)
            console.log(rows1[0])

            const {rows} = await client.query(str,values)
            console.log(rows)

            res.redirect('/:mentors/:grpno/7term');
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
    };
})

app.get('/:mentors/:grpno/7oral' ,(req, res) => {
    teacher = req.params.mentors
    grpno = req.params.grpno
    res.render("7oral",{
        title: "7-oral assessment Page",
        teacher : teacher,
        grpno : grpno
    })
})

app.get('/:mentors/:grpno/8term' ,(req, res) => {
    teacher = req.params.mentors
    grpno = req.params.grpno
    res.render("8term",{
        title: "8-term assessment Page!",
        teacher : teacher,
        grpno : grpno
    })
})

app.get('/:mentors/:grpno/8oral' ,(req, res) => {
    teacher = req.params.mentors
    grpno = req.params.grpno
    res.render("8oral",{
        title: "8-oral assessment Page!",
        teacher : teacher,
        grpno : grpno
    })
})

app.get('/:mentors/:grpno/final', (req ,res) => {
    teacher = req.params.mentors
    grpno = req.params.grpno
    res.render("final",{
        title: "Final assessment Page",
        teacher : teacher,
        grpno : grpno
    })
})



app.get('/:mentors/:grpno/7termReport', (req,res) =>{
    teacher = req.params.mentors
    grpno = req.params.grpno

    str1 = "select title from groups where rno=$1"
    values1 = [grpno]

    str2 = "select rollno2,rollno3,co1_1,co2_1,co1_2,co2_2,co1_3,co2_3 from t7form where rollno1=$1"
    values2 = [grpno]

    str3 = "select "

    async function execute(str1,values1,str2,values2){
        try {
             //Database: Princeton
             var client = new Client({
                user : "postgres",
                password : "Prince@99",
                host : "localhost",
                port : 5432,
                database : "postgres"
            });

            await client.connect()
            console.log("Connected successfully.")
            const {rows1} = await client.query(str1,values1)
            console.log(rows1)

            const {rows2} = await client.query(str2,values2)
            console.log(rows2)

            var total1 = rows2.co1_1 + rows2.co2_1;
            var total2 = rows2.co1_2 + rows2.co2_2;
            var total3 = rows2.co1_3 + rows2.co2_3;

            res.render('../public/views/partials/7termtable.html',{
                teacher : teacher,
                rows1 : rows1,
                rows2 : rows2,
                total1 : total1,
                total2 : total2,
                total3 : total3
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

    res.render("report",{
        title : "Final Group Report",
        teacher : teacher,
        grpno : grpno
    })
})


// Listening port
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})