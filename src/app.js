/* nodejs navigation codes */

/*Libraries*/
const path = require("path")
const hbs = require("hbs")
const express = require("express")
const request = require("request")
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

// Navigator
app.get('' ,(req, res) => {
    res.render("index",{
        title: "The landing Page!",
        name: "project"
    })
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