const  registerRoute=require("express").Router()
const registerActors=require("../controller/registerAuthCont")

const upload=require("../helper/multerMidleWare/uploadImageMidleware")
registerRoute.post("/register",upload.single("profileImage"),  registerActors.register)// register route functionality for all actors
registerRoute.post("/login",registerActors.login)// login route functionalty for actors

module.exports=registerRoute