const mongoose=require("mongoose")
const connectDB=async()=>{
    try {
        
        const connection=mongoose.connect("mongodb://127.0.0.1:27017/complaintDb")
        if (connection) {
            console.log("db connected successfully");
            
        } else {
            console.log("db not connected");
            
        }
    } catch (error) {
        console.log(error)
        
    }
    
}
module.exports=connectDB
