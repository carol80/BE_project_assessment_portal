const { Client } = require('pg');
const path = require("path");
const hbs = require("hbs");
const express = require("express")
const database = require('../config/database.js');
const formchecks = require('../../models/formchecks.js');      //to be included while submitting the form
var conString = database.conString;
const app = express();


/*================================================================
                    Path Declarations
=================================================================*/
const viewpath = path.join(__dirname, "../../public/views");
const partialpath = path.join(__dirname, "../../public/views/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);
hbs.registerHelper("equal", require("handlebars-helper-equal"))


module.exports = {

	
    /*================================================================
	                        Getting Mentors
    =================================================================*/
    //Mentors and their groups into the database
    getMentors : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query("select * from groups where mentor_name=$1",[req.params.mentors])
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
    },


    /*================================================================
	                    Updating groups by mentors 
    =================================================================*/
    //updating groups into the database
    updateGroups : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        try{
            await client.connect()
            console.log("Connected successfully.")
            strteacher = req.params.mentors
            const {rows} = await client.query("update groups set title= $1 where mentor_name= $2 and rno= $3 ",[req.body.title,strteacher,parseInt(req.body.leader_rno)])
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
    },


    /*================================================================
	                Getting group number of Mentors
    =================================================================*/
    //Mentors and their groups into the database
    getgrpno : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        grpno = req.params.grpno;
        teacher = req.params.mentors;
        //------- callback method -------//
        try{
            res.render("forms", {
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
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    },


    /*================================================================
	                    Updating groupno by mentors 
    =================================================================*/
    //updating groups into the database
    updategrpno : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        str = "update groups set title= $1 where mentor_name= $2 and rno= $3 ";
        values = [req.body.title,teacher,parseInt(req.params.grpno)];
        try{
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
            console.log("Client disconnected successfully.");
        }
    },


    /*================================================================
	                Getting group number of Mentors
    =================================================================*/
    //Mentors and their groups into the database
    get7mid1term : async (req, res) => {// Done by *****PRINCETON*****
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        var str = "select * from t7mid1form where mentor=$1 and rollno1=$2";
        values = [teacher,parseInt(grpno)]

        str2 = "select rno1,rno2,title from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7mid1form where rollno1=$1)";
        values3 = [grpno]
        //------- callback method -------//
        try{
            await client.connect()
            console.log("Connected successfully.")

            const status = await client.query(str3,values3)//gives the status
            //console.log(status.rows[0].exists)

            if(!status.rows[0].exists){
                const {rows} = await client.query(str,values)
                //console.table(rows)
    
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                console.log("Rendering New Page......")
                res.render("7mid1term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,
                    listExists : true,
                    status: false
                })
            }
            else{
                const rows = await client.query(str,values)
                //console.table(rows)
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                
                //res.send("Row Exists")// need to do updation by *****JASON*****------same form with prefilled values and submit btn will update the entries in the table
                console.log("Rendering Updation Page......")
                res.render("7mid1term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,

                    co1_1 : rows.rows[0].co1_1,
                    co2_1 : rows.rows[0].co2_1,
                    co3_1 : rows.rows[0].co3_1,
                    co4_1 : rows.rows[0].co4_1,
                    co5_1 : rows.rows[0].co5_1,
                    co6_1 : rows.rows[0].co6_1,
                    co7_1 : rows.rows[0].co7_1,
                    co8_1 : rows.rows[0].co8_1,

                    co1_2 : rows.rows[0].co1_2,
                    co2_2 : rows.rows[0].co2_2,
                    co3_2 : rows.rows[0].co3_2,
                    co4_2 : rows.rows[0].co4_2,
                    co5_2 : rows.rows[0].co5_2,
                    co6_2 : rows.rows[0].co6_2,
                    co7_2 : rows.rows[0].co7_2,
                    co8_2 : rows.rows[0].co8_2,

                    co1_3 : rows.rows[0].co1_3,
                    co2_3 : rows.rows[0].co2_3,
                    co3_3 : rows.rows[0].co3_3,
                    co4_3 : rows.rows[0].co4_3,
                    co5_3 : rows.rows[0].co5_3,
                    co6_3 : rows.rows[0].co6_3,
                    co7_3 : rows.rows[0].co7_3,
                    co8_3 : rows.rows[0].co8_3,

                    listExists : true,
                    status: true
                })
            }
            
        }
        catch (ex)
        {
            console.log(`Something wrong happend here ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    },


    post7mid1term : async (req, res) => {//Work to be done by JASON---add another part in this where it checks the status and then does the according posts
        var client = new Client({
            connectionString: conString,
        })
    
        jsrollno2 = null
        jsrollno3 = null
        teacher = req.params.mentors
        grpno = req.params.grpno
        
        str2 = "select rno1,rno2 from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7mid1form where rollno1=$1)";
        values3 = [grpno]

        try{
            await client.connect()
            const status = await client.query(str3,values3)
            //console.log(status.rows[0].exists)
            if(!status.rows[0].exists){//if row does not exist in table

                console.log("Connected successfully for 1st Query.")
                console.log("Executing 1st Query.......")
                const rows2 = await client.query(str2,values2)
                jsrollno2 = rows2.rows[0].rno1
                jsrollno3 = rows2.rows[0].rno2
                //console.log(jsrollno2,jsrollno3)
                console.log("Updation of 1st Query Done.......")

                str = "insert into t7mid1form (rollno1,rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)";
                values = [parseInt(grpno),parseInt(jsrollno2),parseInt(jsrollno3),
                        parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),parseInt(req.body.co8_1),
                        parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),parseInt(req.body.co8_2),
                        parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),parseInt(req.body.co8_3),
                        teacher];

                console.log("Executing 2nd Query.......")
                const rows = await client.query(str,values)
                console.log("Updation of 2nd Query Done.......")

                str5 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values5 = ['true',parseInt(grpno)]

                console.log("Executing Status Update for 1st.......")
                const rows5 = await client.query(str5,values5)
                console.log("Updated Status of 1st Student.......")


                str6 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values6 = ['true',parseInt(jsrollno2)]

                console.log("Executing Status Update for 2nd.......")
                const rows6 = await client.query(str6,values6)
                console.log("Updated Status of 2nd Student.......")

                str7 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values7 = ['true',parseInt(jsrollno3)]

                console.log("Executing Status Update for 3rd.......")
                const rows7 = await client.query(str7,values7)
                console.log("Updated Status of 3rd Student.......")

                console.log("*********Updation of status done for all....**********")
                
                res.redirect("/"+teacher+"/"+grpno)
            }
            else{//if rows exists in table
                //code for updation -----Done by PRINCETON

                str4 = "update t7mid1form set co1_1 = $1,co2_1 = $2,co3_1 = $3,co4_1 = $4,co5_1 = $5,co6_1 = $6,co7_1 = $7,co8_1 = $8,co1_2 = $9,co2_2 = $10,co3_2 = $11,co4_2 = $12,co5_2 = $13,co6_2 = $14,co7_2 = $15,co8_2 = $16,co1_3 = $17,co2_3 = $18,co3_3 = $19,co4_3 = $20,co5_3 = $21,co6_3 = $22,co7_3 = $23,co8_3 = $24 where rollno1 = $25";
                values4 = [ parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),parseInt(req.body.co8_1),
                            parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),parseInt(req.body.co8_2),
                            parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),parseInt(req.body.co8_3),
                            parseInt(grpno)];

                console.log("Updations in Progress.....")
                const rows4 = await client.query(str4,values4)
                console.log("Updation of Database is Done!!!!")

                res.redirect("/"+teacher+"/"+grpno)
            }
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")    ;
        }
    },


    getmid1termreport : async (req, res) => { //.........Done by PRINCETON
        var client = new Client({
            connectionString: conString,
        })
            teacher = req.params.mentors
            grpno = req.params.grpno
        
            str1 = "select title from groups where rno=$1"
            values1 = [grpno]

            //Write sql for 1st Midterm they have 8 co
            str4 = "select rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3 from t7mid1form where rollno1=$1"
            values4 = [grpno]
        
            execute(str1,values1,str4,values4);
        
            async function execute(str1,values1,str4,values4){
                try {
                    await client.connect()
                    console.log("Connected successfully.")
                    const rows1 = await client.query(str1,values1)
                    //console.log(rows1.rows[0].title)

                    const rows4 = await client.query(str4,values4)
                    console.log(rows4.rows[0])
                    
                    //Calculation of C
                    var total1 = (rows4.rows[0].co1_1) + (rows4.rows[0].co2_1) + (rows4.rows[0].co3_1) + (rows4.rows[0].co4_1) + (rows4.rows[0].co5_1) + (rows4.rows[0].co6_1) + (rows4.rows[0].co7_1) + (rows4.rows[0].co8_1);
                    var total2 = (rows4.rows[0].co1_2) + (rows4.rows[0].co2_2) + (rows4.rows[0].co3_2) + (rows4.rows[0].co4_2) + (rows4.rows[0].co5_2) + (rows4.rows[0].co6_2) + (rows4.rows[0].co7_2) + (rows4.rows[0].co8_2);
                    var total3 = (rows4.rows[0].co1_3) + (rows4.rows[0].co2_3) + (rows4.rows[0].co3_3) + (rows4.rows[0].co4_3) + (rows4.rows[0].co5_3) + (rows4.rows[0].co6_3) + (rows4.rows[0].co7_3) + (rows4.rows[0].co8_3);

                    res.render('7mid1formReport',{
                        teacher : teacher,
                        rollno1 : grpno,
                        title : rows1.rows[0].title,
                        co1_1 : rows4.rows[0].co1_1,    co2_1 : rows4.rows[0].co2_1,
                        co3_1 : rows4.rows[0].co3_1,    co4_1 : rows4.rows[0].co4_1,
                        co5_1 : rows4.rows[0].co5_1,    co6_1 : rows4.rows[0].co6_1,
                        co7_1 : rows4.rows[0].co7_1,    co8_1 : rows4.rows[0].co8_1,
                        rollno2 : rows4.rows[0].rollno2,
                        co1_2 : rows4.rows[0].co1_2,    co2_2 : rows4.rows[0].co2_2,
                        co3_2 : rows4.rows[0].co3_2,    co4_2 : rows4.rows[0].co4_2,
                        co5_2 : rows4.rows[0].co5_2,    co6_2 : rows4.rows[0].co6_2,
                        co7_2 : rows4.rows[0].co7_2,    co8_2 : rows4.rows[0].co8_2,
                        rollno3 : rows4.rows[0].rollno3,
                        co1_3 : rows4.rows[0].co1_3,    co2_3 : rows4.rows[0].co2_3,
                        co3_3 : rows4.rows[0].co3_3,    co4_3 : rows4.rows[0].co4_3,
                        co5_3 : rows4.rows[0].co5_3,    co6_3 : rows4.rows[0].co6_3,
                        co7_3 : rows4.rows[0].co7_3,    co8_3 : rows4.rows[0].co8_3,
                        total1 : total1,    total2 : total2,    total3 : total3,
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
        },




    get7mid2term : async (req, res) => {// Done by *****PRINCETON*****
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        var str = "select * from t7mid2form where mentor=$1 and rollno1=$2";
        values = [teacher,parseInt(grpno)]

        str2 = "select rno1,rno2,title from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7mid2form where rollno1=$1)";
        values3 = [grpno]
        //------- callback method -------//
        try{
            await client.connect()
            console.log("Connected successfully.")

            const status = await client.query(str3,values3)//gives the status
            //console.log(status.rows[0].exists)

            if(!status.rows[0].exists){
                const {rows} = await client.query(str,values)
                //console.table(rows)
    
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                console.log("Rendering New Page......")
                res.render("7mid2term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,
                    listExists : true,
                    status: false
                })
            }
            else{
                const rows = await client.query(str,values)
                //console.table(rows)
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                
                //res.send("Row Exists")// need to do updation by *****JASON*****------same form with prefilled values and submit btn will update the entries in the table
                console.log("Rendering Updation Page......")
                res.render("7mid2term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,

                    co1_1 : rows.rows[0].co1_1,
                    co2_1 : rows.rows[0].co2_1,
                    co3_1 : rows.rows[0].co3_1,
                    co4_1 : rows.rows[0].co4_1,
                    co5_1 : rows.rows[0].co5_1,
                    co6_1 : rows.rows[0].co6_1,
                    co7_1 : rows.rows[0].co7_1,
                    co8_1 : rows.rows[0].co8_1,

                    co1_2 : rows.rows[0].co1_2,
                    co2_2 : rows.rows[0].co2_2,
                    co3_2 : rows.rows[0].co3_2,
                    co4_2 : rows.rows[0].co4_2,
                    co5_2 : rows.rows[0].co5_2,
                    co6_2 : rows.rows[0].co6_2,
                    co7_2 : rows.rows[0].co7_2,
                    co8_2 : rows.rows[0].co8_2,

                    co1_3 : rows.rows[0].co1_3,
                    co2_3 : rows.rows[0].co2_3,
                    co3_3 : rows.rows[0].co3_3,
                    co4_3 : rows.rows[0].co4_3,
                    co5_3 : rows.rows[0].co5_3,
                    co6_3 : rows.rows[0].co6_3,
                    co7_3 : rows.rows[0].co7_3,
                    co8_3 : rows.rows[0].co8_3,

                    total1 : rows.rows[0].co1_1+rows.rows[0].co2_1+rows.rows[0].co3_1+rows.rows[0].co4_1+rows.rows[0].co5_1+rows.rows[0].co6_1+rows.rows[0].co7_1+rows.rows[0].co8_1,
                    total2 : rows.rows[0].co1_2+rows.rows[0].co2_2+rows.rows[0].co3_2+rows.rows[0].co4_2+rows.rows[0].co5_2+rows.rows[0].co6_2+rows.rows[0].co7_2+rows.rows[0].co8_2,
                    total3 : rows.rows[0].co1_3+rows.rows[0].co2_3+rows.rows[0].co3_3+rows.rows[0].co4_3+rows.rows[0].co5_3+rows.rows[0].co6_3+rows.rows[0].co7_3+rows.rows[0].co8_3,

                    listExists : true,
                    status: true
                })
            }
            
        }
        catch (ex)
        {
            console.log(`Something wrong happend here ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    },


    post7mid2term : async (req, res) => {//Work to be done by JASON---add another part in this where it checks the status and then does the according posts
        var client = new Client({
            connectionString: conString,
        })
    
        jsrollno2 = null
        jsrollno3 = null
        teacher = req.params.mentors
        grpno = req.params.grpno
        
        str2 = "select rno1,rno2 from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7mid2form where rollno1=$1)";
        values3 = [grpno]

        try{
            await client.connect()
            const status = await client.query(str3,values3)
            //console.log(status.rows[0].exists)
            if(!status.rows[0].exists){//if row does not exist in table

                console.log("Connected successfully for 1st Query.")
                console.log("Executing 1st Query.......")
                const rows2 = await client.query(str2,values2)
                jsrollno2 = rows2.rows[0].rno1
                jsrollno3 = rows2.rows[0].rno2
                //console.log(jsrollno2,jsrollno3)
                console.log("Updation of 1st Query Done.......")

                str = "insert into t7mid2form (rollno1,rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)";
                values = [parseInt(grpno),parseInt(jsrollno2),parseInt(jsrollno3),
                        parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),parseInt(req.body.co8_1),
                        parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),parseInt(req.body.co8_2),
                        parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),parseInt(req.body.co8_3),
                        teacher];

                console.log("Executing 2nd Query.......")
                const rows = await client.query(str,values)
                console.log("Updation of 2nd Query Done.......")

                str5 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values5 = ['true',parseInt(grpno)]

                console.log("Executing Status Update for 1st.......")
                const rows5 = await client.query(str5,values5)
                console.log("Updated Status of 1st Student.......")


                str6 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values6 = ['true',parseInt(jsrollno2)]

                console.log("Executing Status Update for 2nd.......")
                const rows6 = await client.query(str6,values6)
                console.log("Updated Status of 2nd Student.......")

                str7 = "update formchecks SET term7 = $1 WHERE rno=$2"
                values7 = ['true',parseInt(jsrollno3)]

                console.log("Executing Status Update for 3rd.......")
                const rows7 = await client.query(str7,values7)
                console.log("Updated Status of 3rd Student.......")

                console.log("*********Updation of status done for all....**********")
                
                res.redirect("/"+teacher+"/"+grpno)
            }
            else{//if rows exists in table
                //code for updation -----Done by PRINCETON

                str4 = "update t7mid2form set co1_1 = $1,co2_1 = $2,co3_1 = $3,co4_1 = $4,co5_1 = $5,co6_1 = $6,co7_1 = $7,co8_1 = $8,co1_2 = $9,co2_2 = $10,co3_2 = $11,co4_2 = $12,co5_2 = $13,co6_2 = $14,co7_2 = $15,co8_2 = $16,co1_3 = $17,co2_3 = $18,co3_3 = $19,co4_3 = $20,co5_3 = $21,co6_3 = $22,co7_3 = $23,co8_3 = $24 where rollno1 = $25";
                values4 = [ parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),parseInt(req.body.co8_1),
                            parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),parseInt(req.body.co8_2),
                            parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),parseInt(req.body.co8_3),
                            parseInt(grpno)];

                console.log("Updations in Progress.....")
                const rows4 = await client.query(str4,values4)
                console.log("Updation of Database is Done!!!!")

                res.redirect("/"+teacher+"/"+grpno)
            }
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")    ;
        }
    },


    getmid2termreport : async (req, res) => { //.........Done by PRINCETON
        var client = new Client({
            connectionString: conString,
        })
            teacher = req.params.mentors
            grpno = req.params.grpno
        
            str1 = "select title from groups where rno=$1"
            values1 = [grpno]

            //Write sql for 1st Midterm they have 8 co
            str4 = "select rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3 from t7mid2form where rollno1=$1"
            values4 = [grpno]
        
            execute(str1,values1,str4,values4);
        
            async function execute(str1,values1,str4,values4){
                try {
                    await client.connect()
                    console.log("Connected successfully.")
                    const rows1 = await client.query(str1,values1)
                    //console.log(rows1.rows[0].title)

                    const rows4 = await client.query(str4,values4)
                    console.log(rows4.rows[0])
                    
                    //Calculation of C
                    var total1 = (rows4.rows[0].co1_1) + (rows4.rows[0].co2_1) + (rows4.rows[0].co3_1) + (rows4.rows[0].co4_1) + (rows4.rows[0].co5_1) + (rows4.rows[0].co6_1) + (rows4.rows[0].co7_1) + (rows4.rows[0].co8_1);
                    var total2 = (rows4.rows[0].co1_2) + (rows4.rows[0].co2_2) + (rows4.rows[0].co3_2) + (rows4.rows[0].co4_2) + (rows4.rows[0].co5_2) + (rows4.rows[0].co6_2) + (rows4.rows[0].co7_2) + (rows4.rows[0].co8_2);
                    var total3 = (rows4.rows[0].co1_3) + (rows4.rows[0].co2_3) + (rows4.rows[0].co3_3) + (rows4.rows[0].co4_3) + (rows4.rows[0].co5_3) + (rows4.rows[0].co6_3) + (rows4.rows[0].co7_3) + (rows4.rows[0].co8_3);

                    res.render('7mid2formReport',{
                        teacher : teacher,
                        rollno1 : grpno,
                        title : rows1.rows[0].title,
                        co1_1 : rows4.rows[0].co1_1,    co2_1 : rows4.rows[0].co2_1,
                        co3_1 : rows4.rows[0].co3_1,    co4_1 : rows4.rows[0].co4_1,
                        co5_1 : rows4.rows[0].co5_1,    co6_1 : rows4.rows[0].co6_1,
                        co7_1 : rows4.rows[0].co7_1,    co8_1 : rows4.rows[0].co8_1,
                        rollno2 : rows4.rows[0].rollno2,
                        co1_2 : rows4.rows[0].co1_2,    co2_2 : rows4.rows[0].co2_2,
                        co3_2 : rows4.rows[0].co3_2,    co4_2 : rows4.rows[0].co4_2,
                        co5_2 : rows4.rows[0].co5_2,    co6_2 : rows4.rows[0].co6_2,
                        co7_2 : rows4.rows[0].co7_2,    co8_2 : rows4.rows[0].co8_2,
                        rollno3 : rows4.rows[0].rollno3,
                        co1_3 : rows4.rows[0].co1_3,    co2_3 : rows4.rows[0].co2_3,
                        co3_3 : rows4.rows[0].co3_3,    co4_3 : rows4.rows[0].co4_3,
                        co5_3 : rows4.rows[0].co5_3,    co6_3 : rows4.rows[0].co6_3,
                        co7_3 : rows4.rows[0].co7_3,    co8_3 : rows4.rows[0].co8_3,
                        total1 : total1,    total2 : total2,    total3 : total3,
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
        },

    get7oral : async (req, res) => {// Done by *****PRINCETON*****
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        var str = "select * from t7oral where mentor=$1 and rollno1=$2";
        values = [teacher,parseInt(grpno)]

        str2 = "select rno1,rno2,title from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7oral where rollno1=$1)";
        values3 = [grpno]
        //------- callback method -------//
        try{
            await client.connect()
            console.log("Connected successfully.")

            const status = await client.query(str3,values3)//gives the status
            //console.log(status.rows[0].exists)

            if(!status.rows[0].exists){
                const {rows} = await client.query(str,values)
                //console.table(rows)
    
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                console.log("Rendering New Page......")
                res.render("7oral",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,
                    listExists : true,
                    status: false
                })
            }
            else{
                const rows = await client.query(str,values)
                //console.table(rows)
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                
                //res.send("Row Exists")// need to do updation by *****JASON*****------same form with prefilled values and submit btn will update the entries in the table
                console.log("Rendering Updation Page......")
                res.render("7oral",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,

                    co1_1 : rows.rows[0].co1_1,
                    co2_1 : rows.rows[0].co2_1,
                    co3_1 : rows.rows[0].co3_1,
                    co4_1 : rows.rows[0].co4_1,
                    co5_1 : rows.rows[0].co5_1,
                    co6_1 : rows.rows[0].co6_1,
                    co7_1 : rows.rows[0].co7_1,

                    co1_2 : rows.rows[0].co1_2,
                    co2_2 : rows.rows[0].co2_2,
                    co3_2 : rows.rows[0].co3_2,
                    co4_2 : rows.rows[0].co4_2,
                    co5_2 : rows.rows[0].co5_2,
                    co6_2 : rows.rows[0].co6_2,
                    co7_2 : rows.rows[0].co7_2,

                    co1_3 : rows.rows[0].co1_3,
                    co2_3 : rows.rows[0].co2_3,
                    co3_3 : rows.rows[0].co3_3,
                    co4_3 : rows.rows[0].co4_3,
                    co5_3 : rows.rows[0].co5_3,
                    co6_3 : rows.rows[0].co6_3,
                    co7_3 : rows.rows[0].co7_3,

                    total1 : rows.rows[0].co1_1+rows.rows[0].co2_1+rows.rows[0].co3_1+rows.rows[0].co4_1+rows.rows[0].co5_1+rows.rows[0].co6_1+rows.rows[0].co7_1,
                    total2 : rows.rows[0].co1_2+rows.rows[0].co2_2+rows.rows[0].co3_2+rows.rows[0].co4_2+rows.rows[0].co5_2+rows.rows[0].co6_2+rows.rows[0].co7_2,
                    total3 : rows.rows[0].co1_3+rows.rows[0].co2_3+rows.rows[0].co3_3+rows.rows[0].co4_3+rows.rows[0].co5_3+rows.rows[0].co6_3+rows.rows[0].co7_3,

                    listExists : true,
                    status: true
                })
            }
            
        }
        catch (ex)
        {
            console.log(`Something wrong happend here ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    },


    post7oral : async (req, res) => {//Work to be done by JASON---add another part in this where it checks the status and then does the according posts
        var client = new Client({
            connectionString: conString,
        })
    
        jsrollno2 = null
        jsrollno3 = null
        teacher = req.params.mentors
        grpno = req.params.grpno
        
        str2 = "select rno1,rno2 from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7oral where rollno1=$1)";
        values3 = [grpno]

        try{
            await client.connect()
            const status = await client.query(str3,values3)
            //console.log(status.rows[0].exists)
            if(!status.rows[0].exists){//if row does not exist in table

                console.log("Connected successfully for 1st Query.")
                console.log("Executing 1st Query.......")
                const rows2 = await client.query(str2,values2)
                jsrollno2 = rows2.rows[0].rno1
                jsrollno3 = rows2.rows[0].rno2
                //console.log(jsrollno2,jsrollno3)
                console.log("Updation of 1st Query Done.......")

                str = "insert into t7oral (rollno1,rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)";
                values = [parseInt(grpno),parseInt(jsrollno2),parseInt(jsrollno3),
                        parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),
                        parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),
                        parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),
                        teacher];

                console.log("Executing 2nd Query.......")
                const rows = await client.query(str,values)
                console.log("Updation of 2nd Query Done.......")

                str5 = "update formchecks SET oral7 = $1 WHERE rno=$2"
                values5 = ['true',parseInt(grpno)]

                console.log("Executing Status Update for 1st.......")
                const rows5 = await client.query(str5,values5)
                console.log("Updated Status of 1st Student.......")


                str6 = "update formchecks SET oral7 = $1 WHERE rno=$2"
                values6 = ['true',parseInt(jsrollno2)]

                console.log("Executing Status Update for 2nd.......")
                const rows6 = await client.query(str6,values6)
                console.log("Updated Status of 2nd Student.......")

                str7 = "update formchecks SET oral7 = $1 WHERE rno=$2"
                values7 = ['true',parseInt(jsrollno3)]

                console.log("Executing Status Update for 3rd.......")
                const rows7 = await client.query(str7,values7)
                console.log("Updated Status of 3rd Student.......")

                console.log("*********Updation of status done for all....**********")
                
                res.redirect("/"+teacher+"/"+grpno)
            }
            else{//if rows exists in table
                //code for updation -----Done by PRINCETON

                str4 = "update t7oral set co1_1 = $1,co2_1 = $2,co3_1 = $3,co4_1 = $4,co5_1 = $5,co6_1 = $6,co7_1 = $7,co1_2 = $8,co2_2 = $9,co3_2 = $10,co4_2 = $11,co5_2 = $12,co6_2 = $13,co7_2 = $14,co1_3 = $15,co2_3 = $16,co3_3 = $17,co4_3 = $18,co5_3 = $19,co6_3 = $20,co7_3 = $21 where rollno1 = $22";
                values4 = [ parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),
                            parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),
                            parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),
                            parseInt(grpno)];

                console.log("Updations in Progress.....")
                const rows4 = await client.query(str4,values4)
                console.log("Updation of Database is Done!!!!")

                res.redirect("/"+teacher+"/"+grpno)
            }
        }
        catch (ex)
        {
            console.log(`Something wrong happened ${ex}`)
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")    ;
        }
    },

    get7oralreport : async (req, res) => { //.........Done by PRINCETON
        var client = new Client({
            connectionString: conString,
        })
            teacher = req.params.mentors
            grpno = req.params.grpno
        
            str1 = "select title from groups where rno=$1"
            values1 = [grpno]

            //Write sql for 1st Midterm they have 8 co
            str4 = "select rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3 from t7oral where rollno1=$1"
            values4 = [grpno]
        
            execute(str1,values1,str4,values4);
        
            async function execute(str1,values1,str4,values4){
                try {
                    await client.connect()
                    console.log("Connected successfully.")
                    const rows1 = await client.query(str1,values1)
                    //console.log(rows1.rows[0].title)

                    const rows4 = await client.query(str4,values4)
                    console.log(rows4.rows[0])
                    
                    //Calculation of C
                    var total1 = (rows4.rows[0].co1_1) + (rows4.rows[0].co2_1) + (rows4.rows[0].co3_1) + (rows4.rows[0].co4_1) + (rows4.rows[0].co5_1) + (rows4.rows[0].co6_1) + (rows4.rows[0].co7_1);
                    var total2 = (rows4.rows[0].co1_2) + (rows4.rows[0].co2_2) + (rows4.rows[0].co3_2) + (rows4.rows[0].co4_2) + (rows4.rows[0].co5_2) + (rows4.rows[0].co6_2) + (rows4.rows[0].co7_2);
                    var total3 = (rows4.rows[0].co1_3) + (rows4.rows[0].co2_3) + (rows4.rows[0].co3_3) + (rows4.rows[0].co4_3) + (rows4.rows[0].co5_3) + (rows4.rows[0].co6_3) + (rows4.rows[0].co7_3);

                    res.render('7oralReport',{
                        teacher : teacher,
                        rollno1 : grpno,
                        title : rows1.rows[0].title,
                        co1_1 : rows4.rows[0].co1_1,    co2_1 : rows4.rows[0].co2_1,
                        co3_1 : rows4.rows[0].co3_1,    co4_1 : rows4.rows[0].co4_1,
                        co5_1 : rows4.rows[0].co5_1,    co6_1 : rows4.rows[0].co6_1,
                        co7_1 : rows4.rows[0].co7_1,
                        rollno2 : rows4.rows[0].rollno2,
                        co1_2 : rows4.rows[0].co1_2,    co2_2 : rows4.rows[0].co2_2,
                        co3_2 : rows4.rows[0].co3_2,    co4_2 : rows4.rows[0].co4_2,
                        co5_2 : rows4.rows[0].co5_2,    co6_2 : rows4.rows[0].co6_2,
                        co7_2 : rows4.rows[0].co7_2, 
                        rollno3 : rows4.rows[0].rollno3,
                        co1_3 : rows4.rows[0].co1_3,    co2_3 : rows4.rows[0].co2_3,
                        co3_3 : rows4.rows[0].co3_3,    co4_3 : rows4.rows[0].co4_3,
                        co5_3 : rows4.rows[0].co5_3,    co6_3 : rows4.rows[0].co6_3,
                        co7_3 : rows4.rows[0].co7_3,  
                        total1 : total1,    total2 : total2,    total3 : total3,
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
        },


    get7term : async (req, res) => {// Done by *****PRINCETON*****
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        var str = "select * from t7form where mentor=$1 and rollno1=$2";
        values = [teacher,parseInt(grpno)]

        str2 = "select rno1,rno2,title from groups where rno=$1";
        values2 =[grpno];

        str3 = "select exists(select 1 from t7form where rollno1=$1)";
        values3 = [grpno]
        //------- callback method -------//
        try{
            await client.connect()
            console.log("Connected successfully.")

            const status = await client.query(str3,values3)//gives the status
            //console.log(status.rows[0].exists)

            if(!status.rows[0].exists){
                const {rows} = await client.query(str,values)
                //console.table(rows)
    
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                console.log("Rendering New Page......")
                res.render("7term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,
                    listExists : true,
                    status: false
                })
            }
            else{
                const rows = await client.query(str,values)
                //console.table(rows)
                const rows2 = await client.query(str2,values2)
                //console.log(rows2.rows[0].rno1)
                
                //res.send("Row Exists")// need to do updation by *****JASON*****------same form with prefilled values and submit btn will update the entries in the table
                console.log("Rendering Updation Page......")
                res.render("7term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    //rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,

                    co1_1 : rows.rows[0].co1_1,
                    co2_1 : rows.rows[0].co2_1,
                    co3_1 : rows.rows[0].co3_1,
                    co4_1 : rows.rows[0].co4_1,
                    co5_1 : rows.rows[0].co5_1,
                    co6_1 : rows.rows[0].co6_1,
                    co7_1 : rows.rows[0].co7_1,

                    co1_2 : rows.rows[0].co1_2,
                    co2_2 : rows.rows[0].co2_2,
                    co3_2 : rows.rows[0].co3_2,
                    co4_2 : rows.rows[0].co4_2,
                    co5_2 : rows.rows[0].co5_2,
                    co6_2 : rows.rows[0].co6_2,
                    co7_2 : rows.rows[0].co7_2,

                    co1_3 : rows.rows[0].co1_3,
                    co2_3 : rows.rows[0].co2_3,
                    co3_3 : rows.rows[0].co3_3,
                    co4_3 : rows.rows[0].co4_3,
                    co5_3 : rows.rows[0].co5_3,
                    co6_3 : rows.rows[0].co6_3,
                    co7_3 : rows.rows[0].co7_3,

                    listExists : true,
                    status: true
                })
            }
            
        }
        catch (ex)
        {
            console.log(`Something wrong happend here ${ex}`);
        }
        finally 
        {
            await client.end();
            console.log("Client disconnected successfully.")  ;  
        }
    },


    /*================================================================
	                    Pushing the marks to the Database 
    =================================================================*/
    //updating groups into the database......... done by *****PRINCETON*****
        post7term : async (req, res) => {//Work to be done by JASON---add another part in this where it checks the status and then does the according posts
            var client = new Client({
                connectionString: conString,
            })
        
            jsrollno2 = null
            jsrollno3 = null
            teacher = req.params.mentors
            grpno = req.params.grpno
            
            str2 = "select rno1,rno2 from groups where rno=$1";
            values2 =[grpno];

            str3 = "select exists(select 1 from t7form where rollno1=$1)";
            values3 = [grpno]

            try{
                await client.connect()
                const status = await client.query(str3,values3)
                //console.log(status.rows[0].exists)
                if(!status.rows[0].exists){//if row does not exist in table

                    console.log("Connected successfully for 1st Query.")
                    console.log("Executing 1st Query.......")
                    const rows2 = await client.query(str2,values2)
                    jsrollno2 = rows2.rows[0].rno1
                    jsrollno3 = rows2.rows[0].rno2
                    //console.log(jsrollno2,jsrollno3)
                    console.log("Updation of 1st Query Done.......")

                    str = "insert into t7form (rollno1,rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)";
                    values = [parseInt(grpno),parseInt(jsrollno2),parseInt(jsrollno3),
                            parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),
                            parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),
                            parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),
                            teacher];

                    console.log("Executing 2nd Query.......")
                    const rows = await client.query(str,values)
                    console.log("Updation of 2nd Query Done.......")

                    str5 = "update formchecks SET term7 = $1 WHERE rno=$2"
                    values5 = ['true',parseInt(grpno)]

                    console.log("Executing Status Update for 1st.......")
                    const rows5 = await client.query(str5,values5)
                    console.log("Updated Status of 1st Student.......")


                    str6 = "update formchecks SET term7 = $1 WHERE rno=$2"
                    values6 = ['true',parseInt(jsrollno2)]

                    console.log("Executing Status Update for 2nd.......")
                    const rows6 = await client.query(str6,values6)
                    console.log("Updated Status of 2nd Student.......")

                    str7 = "update formchecks SET term7 = $1 WHERE rno=$2"
                    values7 = ['true',parseInt(jsrollno3)]

                    console.log("Executing Status Update for 3rd.......")
                    const rows7 = await client.query(str7,values7)
                    console.log("Updated Status of 3rd Student.......")

                    console.log("*********Updation of status done for all....**********")
                    
                    //res.send("Done")//replace with needed route
                    res.redirect("/"+teacher+"/"+grpno)
                }
                else{//if rows exists in table
                    //code for updation -----Done by PRINCETON

                    str4 = "update t7form set co1_1 = $1,co2_1 = $2,co3_1 = $3,co4_1 = $4,co5_1 = $5,co6_1 = $6,co7_1 = $7,co1_2 = $8,co2_2 = $9,co3_2 = $10,co4_2 = $11,co5_2 = $12,co6_2 = $13,co7_2 = $14,co1_3 = $15,co2_3 = $16,co3_3 = $17,co4_3 = $18,co5_3 = $19,co6_3 = $20,co7_3 = $21 where rollno1 = $22";
                    values4 = [ parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),parseInt(req.body.co7_1),
                                parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),parseInt(req.body.co7_2),
                                parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),parseInt(req.body.co7_3),
                                parseInt(grpno)];

                    console.log("Updations in Progress.....")
                    const rows4 = await client.query(str4,values4)
                    console.log("Updation of Database is Done!!!!")

                    res.redirect("/"+teacher+"/"+grpno)//replace with needed route
                }
            }
            catch (ex)
            {
                console.log(`Something wrong happened ${ex}`)
            }
            finally 
            {
                await client.end();
                console.log("Client disconnected successfully.")    ;
            }
        },
    //Make another route here regarding updation ......to be done by JASON 

    /*================================================================
                    7term report assigned by group numbers 
    =================================================================*/
    get7termreport : async (req, res) => { //.........Done by PRINCETON
        var client = new Client({
            connectionString: conString,
        })
            teacher = req.params.mentors
            grpno = req.params.grpno
        
            str1 = "select title from groups where rno=$1"
            values1 = [grpno]
        
            str2 = "select rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3 from t7form where rollno1=$1"
            values2 = [grpno]
        
            // str3 = "select co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3 from t7oral where rollno1=$1"
            // values3 = [grpno] // this is wrong

            //Write sql for 1st Midterm they have 8 co
            str4 = "select co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3 from t7mid1form where rollno1=$1"
            values4 = [grpno]
            //Write sql for 2nd Midterm they have 8 co
            str5 = "select co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co7_1,co8_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co7_2,co8_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,co7_3,co8_3 from t7mid2form where rollno1=$1"
            values5 = [grpno] 
        
            execute(str1,values1,str2,values2);
        
            async function execute(str1,values1,str2,values2){
                try {
                    await client.connect()
                    console.log("Connected successfully.")
                    const rows1 = await client.query(str1,values1)
                    //console.log(rows1.rows[0].title)
        
                    const rows2 = await client.query(str2,values2)
                    //console.log(rows2.rows[0])
        
                    // const rows3 = await client.query(str3,values3)
                    // console.log(rows3.rows[0])

                    const rows4 = await client.query(str4,values4)
                    console.log(rows4.rows[0])
        
                    const rows5 = await client.query(str5,values5)
                    console.log(rows5.rows[0])
        
                    // var total1b = (rows3.rows[0].co1_1) + (rows3.rows[0].co2_1) + (rows3.rows[0].co3_1) + (rows3.rows[0].co4_1) + (rows3.rows[0].co5_1) + (rows3.rows[0].co6_1);
                    // var total2b = (rows3.rows[0].co1_2) + (rows3.rows[0].co2_2) + (rows3.rows[0].co3_2) + (rows3.rows[0].co4_2) + (rows3.rows[0].co5_2) + (rows3.rows[0].co6_2);
                    // var total3b = (rows3.rows[0].co1_3) + (rows3.rows[0].co2_3) + (rows3.rows[0].co3_3) + (rows3.rows[0].co4_3) + (rows3.rows[0].co5_3) + (rows3.rows[0].co6_3);
        
                    var total1 = (rows2.rows[0].co1_1) + (rows2.rows[0].co2_1) + (rows2.rows[0].co3_1) + (rows2.rows[0].co4_1) + (rows2.rows[0].co5_1) + (rows2.rows[0].co6_1);
                    var total2 = (rows2.rows[0].co1_2) + (rows2.rows[0].co2_2) + (rows2.rows[0].co3_2) + (rows2.rows[0].co4_2) + (rows2.rows[0].co5_2) + (rows2.rows[0].co6_2);
                    var total3 = (rows2.rows[0].co1_3) + (rows2.rows[0].co2_3) + (rows2.rows[0].co3_3) + (rows2.rows[0].co4_3) + (rows2.rows[0].co5_3) + (rows2.rows[0].co6_3);

                    var total1b = rows2.rows[0].co7_1;
                    var total2b = rows2.rows[0].co7_2;
                    var total3b = rows2.rows[0].co7_3;
        
                    var total1ab = total1 + total1b;
                    var total2ab = total2 + total2b;
                    var total3ab = total3 + total3b;
                    
                    //Calculation of C
                    var total1c = (rows4.rows[0].co1_1) + (rows4.rows[0].co2_1) + (rows4.rows[0].co3_1) + (rows4.rows[0].co4_1) + (rows4.rows[0].co5_1) + (rows4.rows[0].co6_1) + (rows4.rows[0].co7_1) + (rows4.rows[0].co8_1);
                    var total2c = (rows4.rows[0].co1_2) + (rows4.rows[0].co2_2) + (rows4.rows[0].co3_2) + (rows4.rows[0].co4_2) + (rows4.rows[0].co5_2) + (rows4.rows[0].co6_2) + (rows4.rows[0].co7_2) + (rows4.rows[0].co8_2);
                    var total3c = (rows4.rows[0].co1_3) + (rows4.rows[0].co2_3) + (rows4.rows[0].co3_3) + (rows4.rows[0].co4_3) + (rows4.rows[0].co5_3) + (rows4.rows[0].co6_3) + (rows4.rows[0].co7_3) + (rows4.rows[0].co8_3);

                    //Calculation of D
                    var total1d = (rows5.rows[0].co1_1) + (rows5.rows[0].co2_1) + (rows5.rows[0].co3_1) + (rows5.rows[0].co4_1) + (rows5.rows[0].co5_1) + (rows5.rows[0].co6_1) + (rows5.rows[0].co7_1) + (rows5.rows[0].co8_1);
                    var total2d = (rows5.rows[0].co1_2) + (rows5.rows[0].co2_2) + (rows5.rows[0].co3_2) + (rows5.rows[0].co4_2) + (rows5.rows[0].co5_2) + (rows5.rows[0].co6_2) + (rows5.rows[0].co7_2) + (rows5.rows[0].co8_2);
                    var total3d = (rows5.rows[0].co1_3) + (rows5.rows[0].co2_3) + (rows5.rows[0].co3_3) + (rows5.rows[0].co4_3) + (rows5.rows[0].co5_3) + (rows5.rows[0].co6_3) + (rows5.rows[0].co7_3) + (rows5.rows[0].co8_3);

                    //Calculation of Avg of C and D
                    var total1e = (total1c + total1d)/2;
                    var total2e = (total2c + total2d)/2;
                    var total3e = (total3c + total3d)/2;

                    //Calculating Final Total
                    var total1Final = 0.4*(total1ab)+0.6*(total1e);
                    var total2Final = 0.4*(total2ab)+0.6*(total2e);
                    var total3Final = 0.4*(total3ab)+0.6*(total3e);

                    res.render('7termReport',{
                        teacher : teacher,
                        rollno1 : grpno,
                        title : rows1.rows[0].title,
                        co1_1 : rows2.rows[0].co1_1,    co2_1 : rows2.rows[0].co2_1,
                        co3_1 : rows2.rows[0].co3_1,    co4_1 : rows2.rows[0].co4_1,
                        co5_1 : rows2.rows[0].co5_1,    co6_1 : rows2.rows[0].co6_1,
                        rollno2 : rows2.rows[0].rollno2,
                        co1_2 : rows2.rows[0].co1_2,    co2_2 : rows2.rows[0].co2_2,
                        co3_2 : rows2.rows[0].co3_2,    co4_2 : rows2.rows[0].co4_2,
                        co5_2 : rows2.rows[0].co5_2,    co6_2 : rows2.rows[0].co6_2,
                        rollno3 : rows2.rows[0].rollno3,
                        co1_3 : rows2.rows[0].co1_3,    co2_3 : rows2.rows[0].co2_3,
                        co3_3 : rows2.rows[0].co3_3,    co4_3 : rows2.rows[0].co4_3,
                        co5_3 : rows2.rows[0].co5_3,    co6_3 : rows2.rows[0].co6_3,
                        total1 : total1,    total2 : total2,    total3 : total3,
                        total1b : total1b,  total2b : total2b,  total3b : total3b,
                        total1ab : total1ab,    total2ab : total2ab,    total3ab : total3ab,
                        total1c : total1c,  total2c : total2c,  total3c : total3c,
                        total1d : total1d,  total2d : total2d,  total3d : total3d,
                        total1e : total1e,  total2e : total2e,  total3e : total3e,
                        total1Final : total1Final,  total2Final : total2Final,  total3Final : total3Final
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
        },


/*================================================================
	                    Form Form check Updates
    =================================================================*/
    //updating groups into the database
    teacherchecks : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        str = "select * from formchecks where mentor_name in ($1)";
        values=[teacher]
        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.log(rows)
            res.render("teacherchecks", {
                teacher,
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
    },


/*================================================================
	                    Admin Area
    =================================================================*/


/*================================================================
	                        SHOW GROUPS
	=================================================================*/
	//Get all the groups in the database
	showGroups : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query("select * from groups")
            res.render("admin", {
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
    },



/*================================================================
	                    Form Form check Updates
    =================================================================*/
    //updating groups into the database
    formchecks : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        str = "select * from formchecks";
        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str)
            console.log(rows)
            res.render("formchecks", {
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
    },


    
	/*================================================================
	                        INSERT into groups
    =================================================================*/
    //insert groups into the database
    insertGroups : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query("insert into groups (rno,rno1,rno2,title,mentor_name) values ($1, $2, $3, $4, $5)",[parseInt(req.body.rno),parseInt(req.body.rno1),parseInt(req.body.rno2),req.body.title,req.body.mentor_name])
            formchecks.create({
                rno: req.body.rno,
                mentor_name: req.body.mentor_name
            })
            formchecks.create({
                rno: req.body.rno1,
                mentor_name: req.body.mentor_name
            })
            formchecks.create({
                rno: req.body.rno2,
                mentor_name: req.body.mentor_name
            })
            res.render("admin", {
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
            alert("Group added Successfully");
            console.log("Client disconnected successfully.")  ;  
        }
    }

}
