const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
    },
    course_title: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
        enum: ['first', 'second'], // Ensure semester is one of the specified values
    },
    section: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: ['100', '200', '300', '400', '500'], // Ensure level is one of the specified values
    },
    department: {
        type: String,
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
