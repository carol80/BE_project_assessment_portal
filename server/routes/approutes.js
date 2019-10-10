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
    get7term : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        values = [teacher,parseInt(grpno)]
        var str = "select * from t7form where mentor=$1 and grpno=$2";
        //------- callback method -------//
        try{
            await client.connect()
            console.log("Connected successfully.")
            const {rows} = await client.query(str,values)
            console.table(rows)
            res.render("7term",{
                title: "7-term assessment Page",
                grpno : grpno,
                teacher : teacher
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
    },


    /*================================================================
	                    Updating groupno by mentors 
    =================================================================*/
    //updating groups into the database
    update7term : async (req, res) => {
        var client = new Client({
            connectionString: conString,
        })

        teacher = req.params.mentors
        grpno = req.params.grpno
        str = "insert into t7form (rollno1,rollno2,rollno3,co1_1,co2_1,co1_2,co2_2,co1_3,co2_3,mentor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)";
        values = [parseInt(req.body.rollno1),parseInt(req.body.rollno2),parseInt(req.body.rollno3),parseInt(req.body.co1_1),parseInt(req.body.co2_1),parseInt(req.body.co1_2),parseInt(req.body.co2_2),parseInt(req.body.co1_3),parseInt(req.body.co2_3),teacher];

        try{
            await client.connect()
            console.log("Connected successfully.")
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
    }
}