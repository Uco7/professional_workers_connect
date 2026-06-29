
const postRoute=require("express").Router();
const usersAuthCont=require("../controller/authCont")
const crudauthcont=require("../controller/crudeCont")
const upload=require("../helperMildware/imageuploadMildware")
 postRoute.post("/login",usersAuthCont.login)
 postRoute.post("/user/register",usersAuthCont.registerUser)
 postRoute.post("/booked/vendor",usersAuthCont.bookedVendor)
 postRoute.post("/vendor/upload/works",upload.single('profileImage'),usersAuthCont.uploadWorks)
 postRoute.post("/register/admin",upload.single('profileImage'),usersAuthCont.registerAdmin)
 postRoute.post("/register/profession",upload.single('profileImage'),usersAuthCont.registerProfession)
 postRoute.post("/admin/verify/vendor/:id",upload.single('profileImage'),usersAuthCont.adminVerifyvendor)
 postRoute.post("/admin/update/booked/vendor/:id",upload.single('profileImage'),crudauthcont.adminUpdteVendor)
 postRoute.delete('/admin/delete/reg/profession/:id',crudauthcont.deleteRegVendor)
 postRoute.delete('/admin/delete/booked/vendor/:id',crudauthcont.deleteBookedVendor)
module.exports=postRoute  
