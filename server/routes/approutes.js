const { Client } = require('pg');
const path = require("path");
const hbs = require("hbs");
const express = require("express")
const database = require('../config/database.js');
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


module.exports = {

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
	                        INSERT 
    =================================================================*/
    //insert groups into the database
    insertGroups : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query("insert into groups (rno,rno1,rno2,title,mentor_name) values ($1, $2, $3, $4, $5)",[parseInt(req.body.g_m_1),parseInt(req.body.g_m_2),parseInt(req.body.g_m_3),req.body.title,req.body.gpmn])
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
            console.log("Client disconnected successfully.")    ;
        }
    },


    /*================================================================
	                Getting group number of Mentors
    =================================================================*/
    //Mentors and their groups into the database
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
            console.log("hi")
            const status = await client.query(str3,values3)
            console.log(status.rows[0].exists)

            if(!status.rows[0].exists){
                const {rows} = await client.query(str,values)
                console.table(rows)
    
                const rows2 = await client.query(str2,values2)
                console.log(rows2.rows[0].rno1)
    
                res.render("7term",{
                    title: rows2.rows[0].title,
                    grpno : grpno,
                    teacher : teacher,
                    rows : rows,
                    rno1 : rows2.rows[0].rno1,
                    rno2 : rows2.rows[0].rno2,
                    listExists : true
                })
            }
            else{
                res.send("Row Exists")// need to do updation by *****JASON*****------same form with prefilled values and submit btn will update the entries in the table
            }
            
           
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
                console.log(status.rows[0].exists)
                if(!status.rows[0].exists){//if row does not exist in table

                    console.log("Connected successfully for 1st Query.")
                    console.log("Executing 1st Query.......")
                    const rows2 = await client.query(str2,values2)
                    jsrollno2 = rows2.rows[0].rno1
                    jsrollno3 = rows2.rows[0].rno2
                    console.log(jsrollno2,jsrollno3)
                    console.log("Updation of 1st Query Done.......")

                    str = "insert into t7form (rollno1,rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)";
                    values = [parseInt(grpno),parseInt(jsrollno2),parseInt(jsrollno3),
                            parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),
                            parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),
                            parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),
                            teacher];

                    console.log("Executing 2nd Query.......")
                    const rows = await client.query(str,values)
                    console.log("Updation of 2nd Query Done.......")
                    
                    res.send("Done")//replace with needed route
                }
                else{//if rows exists in table
                    //code for updation -----Done by PRINCETON

                    str4 = "update t7form set co1_1 = $1,co2_1 = $2,co3_1 = $3,co4_1 = $4,co5_1 = $5,co6_1 = $6,co1_2 = $7,co2_2 = $8,co3_2 = $9,co4_2 = $10,co5_2 = $11,co6_2 = $12,co1_3 = $13,co2_3 = $14,co3_3 = $15,co4_3 = $16,co5_3 = $17,co6_3 = $18 where rollno1 = $19";
                    values4 = [ parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co3_1),parseInt(req.body.co4_1),parseInt(req.body.co5_1),parseInt(req.body.co6_1),
                                parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co3_2),parseInt(req.body.co4_2),parseInt(req.body.co5_2),parseInt(req.body.co6_2),
                                parseInt(req.body.co1_3),parseInt(req.body.co2_3),parseInt(req.body.co3_3),parseInt(req.body.co4_3),parseInt(req.body.co5_3),parseInt(req.body.co6_3),
                                parseInt(grpno)];

                    console.log("Updations in Progress.....")
                    const rows4 = await client.query(str4,values4)
                    console.log("Updation of Database is Done!!!!")

                    res.send("Updation of Database Done!!")//replace with needed route
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
        
            str2 = "select rollno2,rollno3,co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3 from t7form where rollno1=$1"
            values2 = [grpno]
        
            str3 = "select co1_1,co2_1,co3_1,co4_1,co5_1,co6_1,co1_2,co2_2,co3_2,co4_2,co5_2,co6_2,co1_3,co2_3,co3_3,co4_3,co5_3,co6_3 from t7oral where rollno1=$1"
            values3 = [grpno]
        
            execute(str1,values1,str2,values2,str3,values3);
        
            async function execute(str1,values1,str2,values2,str3,values3){
                try {
                    await client.connect()
                    console.log("Connected successfully.")
                    const rows1 = await client.query(str1,values1)
                    console.log(rows1.rows[0].title)
        
                    const rows2 = await client.query(str2,values2)
                    console.log(rows2.rows[0])
        
                    const rows3 = await client.query(str3,values3)
                    console.log(rows3.rows[0])
        
                    var total1b = (rows3.rows[0].co1_1) + (rows3.rows[0].co2_1) + (rows3.rows[0].co3_1) + (rows3.rows[0].co4_1) + (rows3.rows[0].co5_1) + (rows3.rows[0].co6_1);
                    var total2b = (rows3.rows[0].co1_2) + (rows3.rows[0].co2_2) + (rows3.rows[0].co3_2) + (rows3.rows[0].co4_2) + (rows3.rows[0].co5_2) + (rows3.rows[0].co6_2);
                    var total3b = (rows3.rows[0].co1_3) + (rows3.rows[0].co2_3) + (rows3.rows[0].co3_3) + (rows3.rows[0].co4_3) + (rows3.rows[0].co5_3) + (rows3.rows[0].co6_3);
        
                    var total1 = (rows2.rows[0].co1_1) + (rows2.rows[0].co2_1) + (rows2.rows[0].co3_1) + (rows2.rows[0].co4_1) + (rows2.rows[0].co5_1) + (rows2.rows[0].co6_1);
                    var total2 = (rows2.rows[0].co1_2) + (rows2.rows[0].co2_2) + (rows2.rows[0].co3_2) + (rows2.rows[0].co4_2) + (rows2.rows[0].co5_2) + (rows2.rows[0].co6_2);
                    var total3 = (rows2.rows[0].co1_3) + (rows2.rows[0].co2_3) + (rows2.rows[0].co3_3) + (rows2.rows[0].co4_3) + (rows2.rows[0].co5_3) + (rows2.rows[0].co6_3);
        
                    var total1ab = total1 + total1b;
                    var total2ab = total2 + total2b;
                    var total3ab = total3 + total3b;
        
        
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
                        total1 : total1,
                        total2 : total2,
                        total3 : total3,
                        total1b : total1b,
                        total2b : total2b,
                        total3b : total3b,
                        total1ab : total1ab,
                        total2ab : total2ab,
                        total3ab : total3ab
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
        }
}