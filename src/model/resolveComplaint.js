const mongoose = require('mongoose');

const studentComplaintSchema = new mongoose.Schema({
    uploadedRsult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "uploadedResult",
        required: true
    },

    examAttendance: {
        type: String,
        required: true
    },

    examScore: {
        type: String,
        required: true
    },
    staff_name:{
        type: String,
        required: true
    },
    stu_name: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: false
    },
    matric: {
        type: String,
        required: true
    },
    course_code: {
        type: String,
        required: true
    },
    course_title: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    submitDate: {
        type: Date,
        required: true
    },
    staff: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
            required: true
        },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const StudentComplaint = mongoose.model('resolveComplaint', studentComplaintSchema);

module.exports = StudentComplaint;
