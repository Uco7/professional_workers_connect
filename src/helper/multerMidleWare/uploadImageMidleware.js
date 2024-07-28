
const multer=require("multer");
const storage= multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:1*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        const allowedmimetypes=[
            'image/jpg',
            'image/jpeg',
            'image/png',
        ]
        if(!allowedmimetypes.includes(file.mimetype),false){
            return cb(new Error("only file type of png, jpeg and jpg is allowed"))
        }
        cb(null,true)

    }
})
module.exports=upload