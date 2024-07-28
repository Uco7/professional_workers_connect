const User= require('../model/user');
const Staff=require("../model/staff")
const Admin=require("../model/admin")
const {genUsertoken,genAdmintoken,genStafftoken}=require("../helper/jwtTokenMidleWare/authToken")

module.exports = {
  register: async (req, res) => {
    try {
      const {
        fname,
        email,
        password,
        lname,
        phone_no,
        address,
        date_of_birth,
        state,
        LGA,
        gender,
        middle_name,
        department,
        matric,
        role,
      } = req.body;

      const profileImage = req.file ? req.file.buffer.toString('base64') : null;
      const imageType=req.file?req.file.mimetype:null;
      const commonField={
        fname,
        email,
        password,
        lname,
        phone_no,
        address,
        date_of_birth,
        state,
        LGA,
        gender,
        role

      }
      const studentField={   
        middle_name,
        department,
        matric,
      }
      if (role==="admin") {
        
        const fnameRegex = /^[A-Za-z\s.'-]+$/;
        const lnameRegex = /^[A-Za-z\s.'-]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[<,.])[^\s]{8,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d<,.]{4,}$/;

        const phone_numberRegex = /^\+?\d{1,4}[-\s]?\d{1,15}$/;
        const addressRegex = /^[A-Za-z0-9\s.,#'-]+$/;
        const stateRegex = /^[A-Za-z\s.'-]+$/;
        const lgaRegex = /^[A-Za-z\s\-'’]+$/;

        // Validate input fields
        if (!fnameRegex.test(fname)) throw new Error("Invalid first name format");
        if (!lnameRegex.test(lname)) throw new Error("Invalid last name format");
        if (!emailRegex.test(email)) throw new Error("Invalid email format");
        if (!passwordRegex.test(password)) throw new Error("Invalid password format");
        if (!phone_numberRegex.test(phone_no)) throw new Error("Invalid phone number format");
        if (!addressRegex.test(address)) throw new Error("Invalid address format");
        if (!stateRegex.test(state)) throw new Error("Invalid state format");
        if (!lgaRegex.test(LGA)) throw new Error("Invalid LGA format");
        if (isNaN(Date.parse(date_of_birth))) throw new Error("Invalid date of birth format");

      const newUser = await Admin.create({
    
        ...commonField,
        profileImage,
        imageType
      });

      if (newUser) {
        console.log('User registered successfully:', newUser);
       res.redirect("/login/page")
      }
        
      } 
      else if(role==="staff"){
        const fnameRegex = /^[A-Za-z\s.'-]+$/;
    
        const lnameRegex = /^[A-Za-z\s.'-]+$/;
      
        const emailRegex = /^(?=.{1,256}$)(?=.{1,64}@.{1,255}$)(?=.{1,255}\..{1,255}$)(?=.{2,})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[<,.])[^\s]{8,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d<,.]{4,}$/;

        const phone_numberRegex = /^\+?\d{1,4}[-\s]?\d{1,15}$/;
        const addressRegex = /^[A-Za-z0-9\s.,#'-]+$/;
        const stateRegex = /^[A-Za-z\s.'-]+$/;
        const lgaRegex = /[A-Za-z\s\-'’]+/;
       

        if (!fnameRegex.test(fname)) throw new Error("Invalid first name format");
        if (!lnameRegex.test(lname)) throw new Error("Invalid last name format");
        if (!emailRegex.test(email)) throw new Error("Invalid email format");
        if (!passwordRegex.test(password)) throw new Error("Invalid password format");
        if (!phone_numberRegex.test(phone_no)) throw new Error("Invalid phone number format");
        if (!addressRegex.test(address)) throw new Error("Invalid address format");
        if (!stateRegex.test(state)) throw new Error("Invalid state format");
        if (!lgaRegex.test(LGA)) throw new Error("Invalid LGA format");

      const newStaff = await Staff.create({
       
        ...commonField,
        profileImage,
        imageType
        
      });

      if (newStaff) {
        
        console.log('Staff registered successfully:', newStaff);
        console.log('Staff id:', newStaff._id);
       res.redirect(`/staff/Register/Course?staffId=${newStaff._id}`)
      }
        
      }

    
      
      
      else {
        const fnameRegex = /^[A-Za-z\s.'-]+$/;
        // const depregex = /^[A-Za-z\s.'-]+$/;
       const depregex= /^[A-Za-z\s.\/'-]+$/ ; // Adjusted regex

        const lnameRegex = /^[A-Za-z\s.'-]+$/;
        const m_nameRegex = /^[A-Za-z\s.'-]+$/;
        const emailRegex = /^(?=.{1,256}$)(?=.{1,64}@.{1,255}$)(?=.{1,255}\..{1,255}$)(?=.{2,})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[<,.])[^\s]{8,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d<,.]{4,}$/;

        const phone_numberRegex = /^\+?\d{1,4}[-\s]?\d{1,15}$/;
        const addressRegex = /^[A-Za-z0-9\s.,#'-]+$/;
        const stateRegex = /^[A-Za-z\s.'-]+$/;
        const lgaRegex = /[A-Za-z\s\-'’]+/;
        const matricRegex = /^\d{4}\/[A-Z]+\/\d+$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!fnameRegex.test(fname)) throw new Error("Invalid first name format");
        if (!depregex.test(department)) throw new Error("Invalid department format");
        if (!lnameRegex.test(lname)) throw new Error("Invalid last name format");
        if (!m_nameRegex.test(middle_name)) throw new Error("Invalid middle name format");
        if (!emailRegex.test(email)) throw new Error("Invalid email format");
        if (!passwordRegex.test(password)) throw new Error("Invalid password format");
        if (!phone_numberRegex.test(phone_no)) throw new Error("Invalid phone number format");
        if (!addressRegex.test(address)) throw new Error("Invalid address format");
        if (!stateRegex.test(state)) throw new Error("Invalid state format");
        if (!lgaRegex.test(LGA)) throw new Error("Invalid LGA format");
        if (!matricRegex.test(matric)) throw new Error("Invalid matric format");
        if (!dateRegex.test(date_of_birth)) throw new Error("Invalid date format");

      const newUser = await User.create({
        ...studentField,
        ...commonField,
        profileImage,
        imageType
      });

      if (newUser) {
        console.log('User registered successfully:', newUser);
       res.redirect("/login/page")
      }
        
      }
 
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },
   login :async (req, res) => {
    try {
        const { email, password, matric, role } = req.body;

        if (role === "admin") {
            const loginAdmin = await Admin.login(email, password);
            if (!loginAdmin) {
                return res.status(400).send({ error: 'Invalid email or password' });
            }

            const token = genAdmintoken(loginAdmin._id);
            req.session.token = token;
            req.session.adminId = loginAdmin._id;
            console.log('Login admin', loginAdmin);
            console.log('Token generated in login', token);

            return res.redirect('/admin/dashBord');
        }
        else if (role==="staff") {
          const loginStaff = await Staff.login(email, password);
          if (!loginStaff) {
              return res.status(400).send({ error: 'Invalid email or password' });
          }

          const token = genStafftoken(loginStaff._id);
          req.session.token = token;
          req.session.staffId = loginStaff._id;
          console.log('Login admin', loginStaff);
          console.log('Token generated in login', token);
         return res.redirect("/staff/dashbord")
          
          
        }
        
        else {
            const loginUser = await User.login(matric, password);
            if (!loginUser) {
                return res.status(400).send({ error: 'Invalid matric or password' });
            }

            const token = genUsertoken(loginUser._id);
            req.session.token = token;
            req.session.userId = loginUser._id;
            console.log('Login user', loginUser);
            console.log('Token generated in login', token);

            return res.redirect('/user/dashBord');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
},

 

}  