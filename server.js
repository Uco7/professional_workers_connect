const express=require('express')
const path=require("path");
const bodyParser = require('body-parser');
const sessionMildleWare=require("./src/helper/sessionMidleWare")
const complaintDb=require("./src/connectDB/connectDB")
const pageRenderRoute=require("./src/route/pageRoute")
const registerRoute=require("./src/route/registerActor")
const userHandleRoute=require("./src/route/userAuthRoute")
const apiFindRoute=require("./src/route/crudeRute")


const app=express()
complaintDb()
app.set('views', path.join(__dirname, 'view'));

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
// app.use((req, res, next) => {
//     res.status(404).render('errorPage');
// });

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error');
});
app.use(express.static(path.join(__dirname, "public")))
app.use(sessionMildleWare)

app.use(pageRenderRoute)
app.use(registerRoute)
app.use(userHandleRoute)
app.use(apiFindRoute)
app.listen(5000,()=>{
    console.log('app listen on port 5000')})


