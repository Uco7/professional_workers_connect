const  RefComplaint=require("../model/storeRefComplaint")
const Course=require("../model/couse")
const Email=require("../model/email")

module.exports={
    register: (req, res)=>{
        res.render("register")
    },
    login: (req, res)=>{
        res.render("login")
    },
    errorPage: (req, res)=>{
        res.render("errorPage")
    },
    // sttudent page......................................................................................


    // userDashBord: (req, res)=>{
    //     try {
    //         const user=req.user
    //         if(!user){
    //             return res.status(404).render('errorPage', { message: 'Complaint not found' });
    //         }
    //         console.log('user in session', user);
    //         res.render("./userView/userDashBord",{user})
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send(error)
    //     }
 
 
    // },
    userDashBord:async (req, res) => {
        try {
            let data
            const response=await fetch("http://localhost:5000//api/user/notification")
            if(response.ok){
                data=await response.json()
            }
            const user = req.user;
            
            if (!user) {
                res.status(404).render('errorPage');
                
            }
            const userEmail=user.email
            console.log("user",userEmail)
            const notify= await Email.findOne({email: userEmail})
            console.log("user email", notify)
    
            console.log('User in session:', user);
            res.render('./userView/userDashBord', { user,notify });
        } catch (error) {
            console.error('Error in userDashBord:', error);
            res.status(500).render('errorPage', { message: 'Internal server error' });
        }
    },
    
    studentProfile: async(req, res)=>{
        try {
            const user=req.user
            const userEmail=user.email
            console.log("user",userEmail)
            const notify= await Email.findOne({email: userEmail})
            console.log('user in session in profile', user);

            
        res.render("./userView/studentProfile",{user,notify})

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error.message
            })
            
        }
      
        


    },
    studentCheckResult:async(req, res)=>{
        try {
            const user=req.user
            console.log('user in session in result', user);
            res.render("./userView/studentResult")
        
        } catch (error) {
            console.error('Error in userDashBord:', error);
            res.status(500).render('errorPage', { message: 'Internal server error' });
        }
    },
    // sttudent page......................................................................................



//    staff page................................................................................................

staffProfilePage: async (req, res) => {
    try {
        const staff = req.loginStaff;
   
       
        res.render("./staffView/staffProfile",{staff});
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Internal server error');
        }
    }

},
  staffResolveComplaintPage: async (req, res) => {
   
            try {
              const complaintId = req.query.id;
              if (!complaintId) {
                return res.status(400).send('Complaint ID is required');
              }
        
              const response = await fetch(`http://localhost:5000/api/staff/view/complaint?id=${complaintId}`);
              if (!response.ok) {
                throw new Error('Failed to fetch complaint details');
              }
        
              const data = await response.json();
              if (!data || !data.complaint) {
                return res.status(404).send('Complaint not found');
              }
        
              console.log('fetch staff and student', data);
              res.render('./staffView/staffResolveComplaint', { complaint: data.complaint });
            } catch (error) {
              console.error(error);
              res.status(500).send('Internal server error');
            }
        
        
  },
  staffViewResolvedComplaint: async(req,res)=>{
    try {
        const response = await fetch("http://localhost:5000/api/staff/find/all/resolved/complaints");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const complaint= data.resolvedComplaint
        console.log("staff viewing all resolved complaint in fetch", complaint);
        res.render("./staffView/resolvedComplaint", { complaint });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).send("Error fetching feedback");
    }


  },

    staffUpdateCourse:async (req, res)=>{
         const courseId=req.query.id;
         const response= await fetch(`http://localhost:5000/api/staff/find/course/id?id=${courseId}`)
         const data=  await response.json()
         const  courses=data.course
         console.log('course id in fetch',courses);
        res.render("./staffView/staffUpdateCourse",{courses})
    },
    staffViewComplaint: async(req, res)=>{
        try {
            const complaintId=req.query.id
                const response2= await fetch(`http://localhost:5000/api/staff/view/complaint?id=${complaintId}`)
                const data2=await response2.json()
                const complaint=data2.complaint
                
            
            
                console.log(' complaint  form  STAFF id in fetch',complaint);
               
                res.render("./staffView/staffViewComplaintForm",{complaint})
          
              } catch (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
              }
      
    },
    staffDashBord:async (req, res)=>{
        try {
            const staff = req.loginStaff;
            const staffId = staff._id;

            // Find courses taught by this staff
            const courses = await Course.find({ staff: staffId });
         

            // Extract course codes
            const courseCodes = courses.map(course => course.course_code);

            // Find complaints related to these courses
            const complaints = await RefComplaint.find({ course_code: { $in: courseCodes } }).populate('student', 'fname lname email matric');

            console.log("staff in req", staff);
            console.log("course in req", courses);
            console.log("coursecode in req", courseCodes);
            console.log("complaint in req", complaints);

            // Render the staff dashboard with the complaints data
            res.render("./staffView/staffDashBord", { staff,complaints,courses });
        } catch (error) {
            console.error("Error loading staff dashboard:", error);
            res.status(500).send("Internal Server Error");
        }


    },
    courseStatus: (req, res)=>{
       const  staffId=req.query.staffId
       console.log("stafid in req ",staffId);
       
        res.render("./staffView/staffRegisterCourse",{staffId})
    },
   
   
   //    staff page................................................................................................


    // admin page.....................................................................................
 
    allNewComplaint:async (req, res)=>{
        try {
        
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const allComplaints=data2.allComplaint
        
        
            console.log('all  new page complaint in fetch',allComplaints );
           
            res.render("./adminView/allNewComplaint",{allComplaints})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
    },
    complaintForm:async (req, res)=>{
        try {
        const complaintId=req.query.id
            const response2= await fetch(`http://localhost:5000/api/all/complaints?id=${complaintId}`)
            const data2=await response2.json()
            const complaint=data2.complaint
            
        
        
            console.log(' complaint  form  id in fetch',complaint);
           
            res.render("./adminView/complaintForm",{complaint})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
       
    },
    complaints: async(req, res)=>{
        try {
        
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const allComplaints=data2.allComplaint
        
        
            console.log('all complaint in fetch',allComplaints );
           
            res.render("./adminView/viewComplaints",{allComplaints})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
    },
    adminViewResult: async(req, res)=>{
        try {
         
            response=await fetch("http://localhost:5000/api/admin/view/uploaded/result")
            const data= await response.json()
            const uploadedResult=data.result
            console.log('all user result in fetch',uploadedResult);
            
        res.render("./adminView/viewUploadedResult",{uploadedResult})
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
            
        }
    },
    feedbackpage: async (req, res) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/find/all/resolve/complaints");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const complaint= data.allresolved
            console.log("feed back in fetch", complaint);
            res.render("./adminView/staffFeedBack", { complaint });
        } catch (error) {
            console.error("Error fetching feedback:", error);
            res.status(500).send("Error fetching feedback");
        }
    },
    
viewFeedback: async (req, res) => {
    try {
        const complaintId = req.query.id;

        console.log(`Fetching data for complaintId: ${complaintId}`);

        // Fetch complaint data
        const responseComplaint = await fetch(`http://localhost:5000/api/admin/find/all/resolve/complaints?id=${complaintId}`);
        if (!responseComplaint.ok) {
            throw new Error(`Failed to fetch complaint data. Status: ${responseComplaint.status}`);
        }
        const dataComplaint = await responseComplaint.json();
        const complaint = dataComplaint.viewComplaint;

        console.log("Complaint data fetched:", complaint);

        
      
        res.render("./adminView/viewFeedBack", { complaint});
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).send("Error fetching feedback");
    }
},

    adminProfile: (req, res)=>{
        const admin= req.loginAdmin
        console.log('admin in req profile',admin);

        res.render('./adminView/adminProfile', { admin });
    },
    uploadResult: (req, res)=>{
        res.render("./adminView/uploadResult")
    },
    updateResult: async(req, res)=>{
        
        try {
            const resultId=req.query.id
            response=await fetch(`http://localhost:5000/api/admin/view/uploaded/result?id=${resultId}`)
            const data= await response.json()
            const user=data.result
            console.log('all user result for update in fetch',user);
            res.render("./adminView/updateResult",{user})
       
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
            
        }
    },
    registeredStudent: async(req, res)=>{


    try {
      const response = await fetch('http://localhost:5000/api/find/registered/students');
      const data = await response.json();
      const registeredStudents = data.allUser; // Accessing the allUsers array from the response
  
      console.log('Registered students',registeredStudents );
  
      res.render('./adminView/registeredStudent',{registeredStudents});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
    
},
    registeredStaff:async (req, res)=>{
        // about to right
        try{
        const response = await fetch('http://localhost:5000/api/find/registered/stffs');
        const data = await response.json();
        const registeredStudents = data.allUser; // Accessing the allUsers array from the response
    
        console.log('Registered students',registeredStudents );
    
        res.render('./adminView/registeredStaffs',{registeredStudents});
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    
    },
    adminDashBord: async(req, res)=>{
      
        try {
            const response1 = await fetch('http://localhost:5000/api/find/user/profile');
            const data = await response1.json();
            const registeredStudents = data.allUser; // Accessing the allUsers array from the response
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const allComplaints=data2.allComplaint
            const response3 = await fetch("http://localhost:5000/api/admin/find/all/resolve/complaints");
            if (!response3.ok) {
                throw new Error(`HTTP error! status: ${response3.status}`);
            }
            const data3 = await response3.json();
            const complaint= data3.allresolved
            console.log("feed back in fetch", complaint);
        
            console.log('Registered students',registeredStudents );
            console.log('all complaint in fetch',allComplaints );
            const admin= req.loginAdmin
            console.log('admin in req',admin);
            res.render("./adminView/adminDashBord",{admin,registeredStudents,allComplaints,complaint })
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
    },
  

    
        // admin page.....................................................................................

}