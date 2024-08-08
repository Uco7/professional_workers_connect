const userHandleRoute=require("express").Router();
const adminAuthCont=require("../controller/userAuthCont")
const multipleUpload=require("../helper/multerMidleWare/multipleUpload")
userHandleRoute.post("/submit/complaint/form",multipleUpload,adminAuthCont.submitStudentComplaint)// submitting user complaint route

userHandleRoute.post("/stff/upload/result",adminAuthCont.uploadResult)//  route for  result upload 
userHandleRoute.get("/api/find/registered/students",adminAuthCont.studentProfile)//admin to viw all registered student
userHandleRoute.get("/api/find/registered/staffs",adminAuthCont.staffProfile)//admin to viw all registered student
userHandleRoute.post("/student/view/result",adminAuthCont.studentViewResult)//route for posting student result in db  (student to find their uploaded rwsult)
userHandleRoute.put("/api/admin/update/student/result/:id",adminAuthCont.updateResult)
userHandleRoute.get("/api/find/user/profile",adminAuthCont.studentProfile)
userHandleRoute.post("/staff/register/course",adminAuthCont.registerCourse)
  
module.exports=userHandleRoute
