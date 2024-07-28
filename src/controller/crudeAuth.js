const  Result  = require('../model/result');//storing student results
const User= require('../model/user');//  student schema for storing  student data
const Complaint=require("../model/complaint");//for storing all students  complaint
const RefComplaint=require("../model/storeRefComplaint");// for storing  reference complaints by admin
const StudentComplaint=require("../model/resolveComplaint");//for storing resolved complaints by staffs
const   Course=require("../model/couse");//fore staffs to register their courses
const Email=require("../model/email")
const StaffMail=require("../model/staffMail")
const nodemailer = require('nodemailer');

module.exports={
    adminViewUploadedResult: async(req,res)=>{
    //  function for admin to view all uploaded   s tudent reults
    try {
        if(req.query.id){
            const resultId=req.query.id;
            const result=await Result.findById(resultId).populate('student');
            if(result){
                res.status(201).json({
                    status:"success",
                    result
                })
            }

        }else{
            const result=await Result.find().populate('student')
            if(result){
                console.log('all user result',result)
                res.status(200).json({
                    status:'success',
                    result
                })
            }
            else{
                res.status(404).json({
                    status:"no student results"
                })
            }
    
        }
     
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }

},

adminPostEmail: async (req,res)=>{
    const { name, email,sender_email, message, subject } = req.body;
    const sentAt = new Date();

    // Save the initial data to MongoDB
    const newEmail = new Email({ name, email, message, sender_email,subject, sentAt, status: 'pending' });
    await newEmail.save();

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define email options directly from the request body
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: `
            <h1>Hello, ${name}!</h1>
            
            <p >you recieved this email as  result of the complaint you layed ; sender ${sender_email}</p>
            <p>${message}</p>
            <p>Best regards,<br>Your Company</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            newEmail.status = 'failed';
            await newEmail.save();
            return res.status(500).send(error.toString());
        }
        newEmail.status = 'sent';
        await newEmail.save();
        res.status(200).send('Email sent: ' + info.response);
    });
},
//  userNotification: async(req,res)=>{
//     const notification =await email.find

//  },
staffPostEmail: async (req,res)=>{
    const { name, email,sender_email, message, subject } = req.body;
    const sentAt = new Date();

    // Save the initial data to MongoDB
    const newEmail = new StaffMail({ name, email, message, sender_email,subject, sentAt, status: 'pending' });
    await newEmail.save();

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define email options directly from the request body
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: `
            <h1>Hello, ${name}!</h1>
            
            <p >you recieved this email as  result of the complaint you layed ; sender ${sender_email}</p>
            <p>${message}</p>
            <p>Best regards,<br>Your Company</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            newEmail.status = 'failed';
            await newEmail.save();
            return res.status(500).send(error.toString());
        }
        newEmail.status = 'sent';
        await newEmail.save();
        res.status(200).send('Email sent: ' + info.response);
    });
},


// end.............................................................................
notifyUser:async(req,res)=>{
    try {
        const  notification= await StaffMail.find()
        if(notification){
            console.log("user notification",notification);
            res.status(200).json({
                status:"success"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            error:error.message||"internal server error"
        })
        
    }

},
allComplaint: async(req,res)=>{
    try {
        if(req.query.id){
            const  complaintId=req.query.id;
            const complaint=await Complaint.findById(complaintId).populate('student')
            if(!complaint){
                return res.status(404).json({
                    status:' no complaint found'
                })
            }
            else{
                console.log('single complaint',complaint)
                res.status(200).json({
                    status:"success",
                    complaint
                })
            }
        }
        else{
            const allComplaint=await Complaint.find().populate('student')
            if(allComplaint){
                console.log("all complaint",allComplaint);
                res.status(200).json({
                    status:"success",
                    allComplaint
                })
            }
        }
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }

},

storeComplaint: async (req, res) => {
    try {
        const {
            email,
            course_title,
            course_code,
            complaint_date,
            level,
            comment,
            matric,
            section,
            semester,
            existingRegisteredCourse,
            existingResult,
        } = req.body;
         console.log('req.body',req.body);
        const student = await User.findOne({ matric });
        if (!student) {
            return res.status(404).send("Student not found");
        }

        let registeredCourse = existingRegisteredCourse;
        let result = existingResult;

        if (req.files) {
            if (req.files.registeredCourse && req.files.registeredCourse[0]) {
                registeredCourse = req.files.registeredCourse[0].buffer.toString('base64');
            }
            if (req.files.result && req.files.result[0]) {
                result = req.files.result[0].buffer.toString('base64');
            }
        }

        if (!registeredCourse || !result) {
            return res.status(400).send("Both registeredCourse and result are required");
        }

        const course = await Course.findOne({ course_code });
        if (!course) {
            return res.status(404).send("Course not found");
        }

        const newStoredComplaint = new RefComplaint({
            student: student._id,
            email,
            complaint_date,
            comment,
            registeredCourse,
            course_title,
            course_code,
            result,
            level,
            section,
            semester,
            staff: course.staff
        });

        await newStoredComplaint.save();

        console.log("Complaint saved:", newStoredComplaint);
        return res.status(200).json({
           status:"success",
          message:  "Complaint stored successfully",
            newStoredComplaint
        
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
},

findStoredComplaint:async(req,res)=>{
    try {
        if(req.query.id){
            const  complaintId=req.query.id;
            const complaint=await RefComplaint.findById(complaintId).populate('student').populate('staff')
            if(!complaint){
                return res.status(404).json({
                    status:' no complaint found'
                })
            }
            else{
                console.log('single complaint',complaint)
                res.status(200).json({
                    status:"success",
                    complaint
                })
            }
        }
        else{
            const allComplaint=await RefComplaint.find().populate('student').populate('staff')
            if(allComplaint){
                console.log("all complaint",allComplaint);
                res.status(200).json({
                    status:"success",
                    allComplaint
                })
            }
        }
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }


},

staffResolveComplaint: async(req,res)=>{
    try {
        console.log('Received request:', req.body);
        console.log('Received files:', req.files);

        const {
            stu_name,
            department,
            matric,
            submitDate,
            comment,
            course_title,
            course_code,
            level,
            section,
            semester,
            email,
            phone_no,
            staff_name
        } = req.body;

        // Check if files are present
        if (!req.files || !req.files.examAttendance || !req.files.examScore) {
            return res.status(400).send({ message: 'Files are missing' });
        }

        // Convert files to base64
        const examAttendance = req.files.examAttendance[0].buffer.toString('base64');
        const examScore = req.files.examScore[0].buffer.toString('base64');

        // Find course by course_code
        const course = await Course.findOne({ course_code });
        if (!course) {
            return res.status(404).send({ message: 'Course not found for the provided course code' });
        }

        // Find uploaded result by matric
        const uploadedResult = await Result.findOne({ matric });
        if (!uploadedResult) {
            return res.status(404).send({ message: 'Uploaded result not found for the provided matric number' });
        }

        // Create new StudentComplaint instance
        const newResolveComplaint = new StudentComplaint({
            examAttendance,
            examScore,
            stu_name,
            department,
            matric,
            submitDate,
            comment,
            course_title,
            course_code,
            uploadedRsult: uploadedResult._id,
            level,
            section,
            semester,
            email,
            phone_no,
            staff_name,
            staff: course._id
        });

        // Save complaint to database
        await newResolveComplaint.save();
        console.log('Resolved complaint:', newResolveComplaint);

        res.status(200).send({ message: 'Complaint submitted successfully' });

    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(400).send({ message: 'Error submitting complaint', error: error.message });
    }

    
 
},
findResolvedComplaint: async(req,res)=>{
    try{
        const resolvedComplaint=await StudentComplaint.find().populate('uploadedRsult')
        if(resolvedComplaint){
            console.log("  staff  find all resove complaint ",resolvedComplaint);
            res.status(201).json({
                status:"success",
                resolvedComplaint
            })
        }

    
  
    
} catch (error) {
    console.log(error); 
    res.status(500).json({
        error:error.message
    })
    
}

},

adminFindResolveComplaint: async(req,res)=>{
    try {
        if(req.query.id){
            const complaintId=req.query.id
            const viewComplaint=await StudentComplaint.findById(complaintId).populate('uploadedRsult')
            if(viewComplaint){
                console.log("single complaint",viewComplaint)
                res.status(201).json({
                    status:'success',
                    viewComplaint
                })
            }
        }
        else{
            const allresolved=await StudentComplaint.find().populate('uploadedRsult')
            if(allresolved){
                console.log("all resove complaint ",allresolved);
                res.status(201).json({
                    status:"success",
                    allresolved
                })
            }

        }
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }
},
findCourse: async(req,res)=>{
    try {
        if(req.query.id){
            const courseId=req.query.id;
            const course=await Course.findById(courseId);
            if(course){
                console.log("course id:",course)
                res.status(201).json({
                    status:'success',
                    course
                })
            }
        }
    
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }


},
updateCourse: async(req,res)=>{
    try {
        if(req.params){
            const courseId=req.params.id;
            const body=req.body;
            const course= await Course.findByIdAndUpdate(courseId,body,{new:true})
            if(course){
                res.status(201).json({
                    status:"success",
                    course
                })
            }
            else{
                res.status(404).json({
                    status:"course not found"
                })
            }

        }
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message

        })
        
    }

}
}