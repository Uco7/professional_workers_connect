const multer=require("multer")
const storage= multer.memoryStorage()
const upload= multer({
    storage:storage,
    limits:{files:1*1024*1024},
    fileFilter:(req, file, cb)=>{
        const allowedFileType=[
            "image/jpg",
            "image/png",
            "image/jpeg",
        ]
        if(!allowedFileType.includes(file.mimetype),false){
            cb(new Error("only file type of png,jpg, jpeg is allowed and file size of 1mb"))
        }
        cb(null, true)
    }
    })
        const multipleUpload=upload.fields([
            {name:"registeredCourse",maxCount:1},
            {name:"result",maxCount:1}
         
        ])
        module.exports=multipleUpload