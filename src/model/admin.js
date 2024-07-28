const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    middle_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_no: { type: String, required: true },
    address: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    state: { type: String, required: true },
    LGA: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true }
});

adminSchema.pre("save",async function(next){
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt)
    next();
})
adminSchema.statics.login= async function(email, password){
    const userExist=await this.findOne({email})
    if(userExist){
        const isPswMatch= await bcrypt.compare(password,userExist.password);
      if(isPswMatch){
        return userExist;

    } 

    throw new Error("password miss matched or invalide email")
    }
throw new Error ("admin not found")
}

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
