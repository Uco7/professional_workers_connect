const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { type } = require('jquery');

const userSchema = new mongoose.Schema({
  // staffCourse:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"Course",
  //   required:true
  // },
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
   
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum password length
  },
  lname: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
    match: [
      /^\+?\d{1,4}[-\s]?\d{1,15}$/,
      'Please fill a valid phone number',
    ],
  },
  address: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  LGA: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'], // Ensure gender is one of the specified values
  },

  
 
  role:{
    type: String,
    required: true,
    enum: ['student', 'admin','staff'], // Ensure role is one of the specified values
  },
  profileImage: {
    type: String,
    required:true // Assuming you store the image as a base64 string
  },
  imageType:{
    type: String,
    required:true 
    
  }
});
userSchema.pre("save", async function(next){
    const salt= await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password, salt);
    next();
})
userSchema.statics.login= async function(email, password){
    const userExist=await this.findOne({email})
    if(userExist){
        const isPswMatch= await bcrypt.compare(password,userExist.password);
      if(isPswMatch){
        return userExist;

    } 

    throw new Error("password miss matched or invalide matric")
    }
throw new Error ("user not found")
}
const Staff = mongoose.model('Staff', userSchema);

module.exports = Staff




