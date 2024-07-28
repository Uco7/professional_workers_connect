const session=require("express-session");
require("dotenv").config()
const sessionMildleWare=session({
    secret:process.env.SESSION_SECRETE,
    resave:false,
    saveUninitialized:true
})
module.exports=sessionMildleWare