const crudeRoute=require("express").Router();
const  crudeAuth=require("../controller/crudeAuth")
const multipleUpload=require("../helper/multerMidleWare/multipleUpload")
const multipleImage=require("../helper/multerMidleWare/multipleImage")
crudeRoute.get("/api/admin/view/uploaded/result",crudeAuth.adminViewUploadedResult)

crudeRoute.get("/api/admin/find/all/resolve/complaints",crudeAuth.adminFindResolveComplaint)
crudeRoute.get("/api/staff/view/complaint",crudeAuth.findStoredComplaint)
crudeRoute.get("/api/staff/all/complaints",crudeAuth.staffAllComplaint)
crudeRoute.get("/api/all/complaints",crudeAuth.allComplaint)
crudeRoute.get("/api/staff/find/course/id",crudeAuth.findCourse)
crudeRoute.get("/api/staff/view/user/result",crudeAuth. staffViewUploadedResult)
crudeRoute.get("/api/staff/find/course/id",crudeAuth.notifyUser)
crudeRoute.get("/api/staff/find/all/resolved/complaints",crudeAuth.findResolvedComplaint)
crudeRoute.get("/api/user/notification",crudeAuth.findResolvedComplaint)
crudeRoute.put("/api/staff/update/course/:id",crudeAuth.updateCourse)
crudeRoute.post("/admin/send/email",crudeAuth.adminPostEmail)
crudeRoute.post("/staff/send/email",crudeAuth.staffPostEmail)
crudeRoute.post("/admin/store/ref/complaints",multipleUpload,crudeAuth.storeComplaint)
crudeRoute.post("/submit/form",multipleImage,crudeAuth.staffResolveComplaint)


module.exports=crudeRoute