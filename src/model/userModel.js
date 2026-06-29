
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true
    },
    lName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    phone_no: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving

userSchema.pre("save", async function(next){
    const salt= await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password, salt);
    next();
})
userSchema.statics.login = async function(email, password) {
    console.log(`Attempting login with email: ${email}`); // Add logging
    const userExis = await this.findOne({ email });
    if (userExis) {
      console.log(`User found: ${userExis.email}`); // Add logging
      const ispswMatch = await bcrypt.compare(password, userExis.password);
      if (!ispswMatch) {
        console.log('Password mismatch'); // Add logging
        throw new Error("Invalid password or email");
      }
      return userExis;
    }
    console.log('User not found'); // Add logging
    throw new Error("User not found");
  }
 const User= mongoose.model('User', userSchema);
module.exports =User

