
const getPage=require("express").Router()
const page=require("../service/pageRender")
const crudauthcont=require("../controller/crudeCont")
const {verifyUserToken,verifyAdminToken}=require("../helperMildware/jwtToken")
getPage.get("/",page.homePage)
getPage.get("/index/page",verifyUserToken, page.indexPage)
getPage.get("/user/registration/page",page.userReg)
getPage.get("/user/login/page",page.loginUser)
getPage.get("/login/page",page.loginUser)
getPage.get("/admin/login/page",page.loginAdmin)
getPage.get("/vendor/upload/work/page",page.vendorUploadedWorkPage)
getPage.get("/view/vendor/upload/work/page",page.vendorWorkPage)
getPage.get("/clients/book/vendor/page",page.clientBookVendor)
getPage.get("/admin/dashbord",verifyAdminToken,page.adminDashBord)
getPage.get("/admin/registration/page",page.adminRegPage)
getPage.get("/admin/verified/vendors/page",page.adminVerifiedVendors)
getPage.get("/admin/reg/vendors/page",page.viewVendors)
getPage.get("/admin/booked/vendors/page",page.bookedVendors)
getPage.get("/vendor/register/profession",page.regProfession)
getPage.get("/update/vendor/page",page.updateVendor)
getPage.get("/admin/verify/vendor/page",page.adminVerifyVendorPage)
// crude auth functionality.module.........................................
getPage.get("/find/user/in/vendor/page",crudauthcont.findUser)
getPage.post("/find/vendor/by/email",crudauthcont.findVendorByEmail)
getPage.get("/admin/find/verified/vendor",crudauthcont.findVerifiedVendor)
getPage.get("/admin/find/booked/vendor",crudauthcont.findBookedVendor)
getPage.get("/api//find/vendor/uploaded/works",crudauthcont.findVendorWorks)

getPage.get("/admin/find/registered/user",crudauthcont.adminFindRegUsers)
getPage.get("/admin/find/registered/vendor/page",crudauthcont.adminFindVendor)

// crude auth functionality.module.........................................

module.exports=getPage
