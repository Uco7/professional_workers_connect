
const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
  course_title: { type: String, required: true },
  course_code: { type: String, required: true },
  course_unit: { type: Number, required: true },
  assessment1: { type: Number, required: true },
  assessment2: { type: Number, required: true },
  exam_score: { type: Number, required: true },
  total_score: { type: Number, required: true },
  grade: { type: String, required: true }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  matric: { type: String, required: true },
  department: { type: String, required: true },
  section: { type: String, required: true },
  level: { type: Number, required: true },
  semester: { type: String, required: true },
  courses: [courseSchema]  // Embed the course schema as an array
});

const Result = mongoose.model('uploadedResult', userSchema);

module.exports = Result;

