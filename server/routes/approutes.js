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
const viewpath = path.join(__dirname, "../../pages/views");
const partialpath = path.join(__dirname, "../../pages/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);


module.exports = {

	/*================================================================
	                            SHOW
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
            // values = [parseInt(req.body.g_id), parseInt(req.body.g_m_1), parseInt(req.body.g_m_2), parseInt(req.body.g_m_3), req.body.title, req.body.gpmn];
            const {rows} = await client.query("insert into groups values($1, $2, $3, $4, $5, $6)",[parseInt(req.body.g_m_1),req.body.title,parseInt(req.body.gpno),parseInt(req.body.g_m_2),parseInt(req.body.g_m_3),req.body.mentor_name])
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
            const {rows} = await client.query("update groups set title= $1 where mentor_name= $2 and rno= $3 ",[req.body.title,strteacher,parseInt(req.body.leader_rno)])
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
}