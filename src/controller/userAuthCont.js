const  Result  = require('../model/result');
const User= require('../model/user');
const Complaint=require("../model/complaint");
const Course=require("../model/couse");
const Email=require("../model/email")
const Staff=require("../model/staff")



module.exports={
  submitStudentComplaint: async (req, res) => {
    try {
        const {
            
            department,
            email,
            phone_no,
            course_title,
            course_code,
            section,
            level,
            semester,
            matric,
            comment,
            existingRegisteredCourse,
            existingResult,
            complaint_date
        } = req.body;

        // Find the student by matric number
        const student = await User.findOne({ matric });
        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Process files if they are uploaded, else use existing ones
        let registeredCourse = existingRegisteredCourse;
        let result = existingResult;
        if (req.files) {
            if (req.files.registeredCourse) {
                registeredCourse = req.files.registeredCourse[0].buffer.toString('base64');
            }
            if (req.files.result) {
                result = req.files.result[0].buffer.toString('base64');
            }
        }

        // Create new complaint instance
        const newComplaint = new Complaint({
            student: student._id,
            email,
            course_title,
            course_code,
            department,
            phone_no,
            registeredCourse,
            result,
            section,
            semester,
            level,
            comment,
            complaint_date
        });

        // Save complaint to database
        await newComplaint.save();

        console.log("Complaint saved:", newComplaint);
        res.status(200).send("Complaint submitted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
},


uploadResult: async (req, res) => {
  try {
      const { name, matric, department, section, level, semester, courses } = req.body;

      // Log the parsed courses array
      console.log("Parsed courses array:", courses);

      // Validate the courses array
      if (!Array.isArray(courses) || courses.length === 0) {
          return res.status(400).json({
              status: "failure",
              message: "Courses array is empty or invalid."
          });
      }

      // Find the user by matric
      const user = await User.findOne({ matric });

      if (!user) {
          return res.status(404).json({
              status: "failure",
              message: "User not found"
          });
      }

      // Create a new result instance with the parsed data
      const userResult = new Result({
          student: user._id,
          name,
          matric,
          department,
          section,
          level,
          semester,
          courses
      });

      // Save the result to the database
      await userResult.save();

      // Send a success response
      res.status(201).json({
          status: "success",
          userResult
      });
  } catch (error) {
      console.error(error);
      res.status(400).json({
          status: "failure",
          message: "Result upload failed",
          error: error.message
      });
  }
},

  
  studentViewResult:async(req,res)=>{
    try {
      const {matric, level,section,semester}=req.body;
      const result=await Result.findOne({
        matric, level,section,semester
      })
      if(result){
        const user=await User.findOne({matric})

        const notify= await Email.findOne({email:user.email})
        console.log("result notify",notify);
        console.log("result found",result);
  
      
       res.render("./userView/studentResult",{result,notify,user})
      }
      else{
        res.status(400).json({
          status:"no result found"
        })
      }
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error:error.message
      })
      
    }

  },
  studentProfile: async(req,res)=>{
    try {
      if (req.query.id) {
        const userId=req.query.id
        // const body=req.body;
        const user= await User.findById(userId)
        if(user){
          console.log('retrived user',user);
          res.status(201).json({
            status:'success',
            user

          })

        }
       
        
      } else {
        const allUser=await User.find()
        if (allUser) {
          console.log('all useer',allUser);
          res.status(201).json({
            status:'success',
            allUser
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

  updateResult: async(req,res)=>{
    
    try {
        if(req.params.id){
          const resultId=req.params.id;
          const updateData=req.body
          const result=await Result.findByIdAndUpdate(resultId,updateData,{new:true})
          if(result){
            return res.status(200).json({
              status:"success",
              result
            })
          }else{
            res.status(404).json({
              status:"result not found"
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
  registerCourse: async (req, res) => {
    const { course_title, course_code, section, semester, department, level, staffId } = req.body;
    // console.log('id',);

    try {
      const newCourse = await Course.create({
        course_title,
        course_code,
        section,
        semester,
        department,
        level,
        staff:staffId  // Make sure `staff` is correctly assigned here
      });
      
      console.log("Staff registered course:", newCourse);
      res.redirect("/login/page");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    
  
},

staffProfile: async(req,res)=>{
  try {
    if (req.query.id) {
      const userId=req.query.id
      // const body=req.body;
      const  staff= await Staff.findById(userId)
      if( staff){
        console.log('retrived user', staff);
        res.status(201).json({
          status:'success',
          staff

        })

      }
     
      
    } else {
      const allStaffs=await Staff.find()
      if (allStaffs) {
        console.log('all useer',allStaffs);
        res.status(201).json({
          status:'success',
          allStaffs
        })
        
      }
      
    }


    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:error.message
    })
    
  }
}}