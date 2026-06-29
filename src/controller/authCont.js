const User=require("../model/userModel");
const Admin=require("../model/adminmodel")
const Profession=require("../model/professionModel")
const BookedVendor=require("../model/bookedVendor")
const VerifiedVendor=require("../model/veryfiedVendor")
const VendorWork=require("../model/vendorWorks")
const {genAdmintoken,genUserToken}=require("../helperMildware/jwtToken");
const mongoose = require('mongoose');



module.exports={
    registerAdmin: async (req, res) => {
        try {
            const { fName, email, password, lName, phone_no, address, date_of_birth, state, LGA, gender } = req.body;
            const profileImage = req.file ? req.file.buffer.toString("base64") : null;
            const imageType = req.file ? req.file.mimetype : null;
    
            // Validation
            const fnameRegex = /^[A-Za-z\s.'-]+$/;
            const lnameRegex = /^[A-Za-z\s.'-]+$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&<>^.,:;[\]{}()|~`#\-_/\\+=]{4,}$/;
            const phone_numberRegex = /^\+?\d{1,4}[-\s]?\d{1,15}$/;
            const addressRegex = /^[A-Za-z0-9\s.,#'-]+$/;
            const stateRegex = /^[A-Za-z\s.'-]+$/;
            const lgaRegex = /^[A-Za-z\s\-'’]+$/;
    
            if (!fnameRegex.test(fName)) throw new Error("Invalid first name format");
            if (!lnameRegex.test(lName)) throw new Error("Invalid last name format");
            if (!emailRegex.test(email)) throw new Error("Invalid email format");
            if (!passwordRegex.test(password)) throw new Error("Invalid password format");
            if (!phone_numberRegex.test(phone_no)) throw new Error("Invalid phone number format");
            if (!addressRegex.test(address)) throw new Error("Invalid address format");
            if (!stateRegex.test(state)) throw new Error("Invalid state format");
            if (!lgaRegex.test(LGA)) throw new Error("Invalid LGA format");
            if (isNaN(Date.parse(date_of_birth))) throw new Error("Invalid date of birth format");
    
            const newAdmin = await Admin.create({
                fName,
                email,
                password,
                lName,
                phone_no,
                address,
                date_of_birth,
                state,
                LGA,
                gender,
                profileImage,
                imageType
            });
    
            if (newAdmin) {
                console.log("Admin created successfully", newAdmin);
                res.redirect("/admin/login/page");
            } else {
                res.status(400).json({ message: "Registration failed" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message || "Internal server error"
            });
        }
    },
    

        registerUser: async (req, res) => {
            try {
                const { fName, email, password, lName, phone_no, gender } = req.body;
                console.log(req.body);
                
                const fnameRegex = /^[A-Za-z\s.'-]+$/;
                const lnameRegex = /^[A-Za-z\s.'-]+$/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&<>^.,:;[\]{}()|~`#\-_/\\+=]{8,}$/;
                const phone_numberRegex = /^\+?\d{1,4}[-\s]?\d{1,15}$/;
        
                // Validate input fields
                if (!fnameRegex.test(fName)) throw new Error("Invalid first name format");
                if (!lnameRegex.test(lName)) throw new Error("Invalid last name format");
                if (!emailRegex.test(email)) throw new Error("Invalid email format");
                if (!passwordRegex.test(password)) throw new Error("Invalid password format");
                if (!phone_numberRegex.test(phone_no)) throw new Error("Invalid phone number format");
        
                // Hash the password before saving
                const newUser = await User.create({
                    fName,
                    email,
                    password,
                    lName,
                    phone_no,
                    gender,
                });
        
                if (!newUser) {
                    console.log(" Registration failed ");
                 return   res.redirect("/user/login/page");
                }
             
                    console.log("User created successfully", newUser);
           
        
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    message: error.message || "Internal server error",
                });
            }
        },
        
    registerProfession: async (req, res) => {
        try {
            const {
                phone_no,
                address,
                date_of_birth,
                state,
                LGA,
                job_title,
                Years_of_experience,
                qualification,
                skills_tools,
                bio,
                userId // Added for user lookup
            } = req.body;
            console.log(" profession user id",userId);
            
    
            // Handle profile image
            const profileImage = req.file ? req.file.buffer.toString("base64") : null;
            const imageType = req.file ? req.file.mimetype : null;
    
            // Regex for validation
            const addressRegex = /^[A-Za-z0-9\s.,#'-]+$/;
            const stateRegex = /^[A-Za-z\s.'-]+$/;
            const lgaRegex = /^[A-Za-z\s\-'’]+$/;
            const jobTitleRegex = /^[A-Za-z\s.,'-]+$/;
           
            const skillsToolsRegex = /^[A-Za-z0-9\s.,'!@#$%^&*()_+=[\]{}|;:<>?-]+$/;
            const bioRegex = /^[A-Za-z0-9\s.,'!@#$%^&*()_+=[\]{}|;:<>?-]{10,}$/; // Minimum 10 characters
    
            // Validate input fields
            if (!addressRegex.test(address)) throw new Error("Invalid address format");
            if (!stateRegex.test(state)) throw new Error("Invalid state format");
            if (!lgaRegex.test(LGA)) throw new Error("Invalid LGA format");
            if (!jobTitleRegex.test(job_title)) throw new Error("Invalid job title format");
            if (!skillsToolsRegex.test(skills_tools)) throw new Error("Invalid skills/tools format");
            if (!bioRegex.test(bio)) throw new Error("Bio must be at least 10 characters long");

            // Validate and find user by email
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
    
            // Create new Profession document
            const newProfession = await Profession.create({
                phone_no,
                address,
                state,
                LGA,
                job_title,
                date_of_birth,

                Years_of_experience,
                qualification,
                skills_tools,
                bio,
                profileImage,
                imageType,
                userRef: user._id // Assign the user's ID
            });
    
            if (newProfession) {
                console.log("Profession registered successfully", newProfession);
                res.status(200).json({
                    status: "success",
                    message: "Profession registered successfully",
                    newProfession
                });
            } else {
                console.log("Registration failed");
                res.status(400).json({
                    status: "failure",
                    message: "Registration failed"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message || "Internal server error"
            });
        }
    },
    // adminVerifyvendor: async (req, res) => {
    //     try {
    //         const vendorId = req.params.id;
    
    //         // Extract fields from the form data
    //         const {
    //             verification_status,
    //             userId
    //         } = req.body;
    
    //         // Extract profile image and image type from the form data if uploaded
    //         const profileImage = req.file ? req.file.buffer.toString('base64') : req.body.profileImage;
    //         const imageType = req.file ? req.file.mimetype : req.body.imageType;
    
    //         // Find the user in the UserProfession collection by ID
    //         const vendor = await Profession.findById(vendorId);
    
    //         if (!vendor) {
    //             return res.status(404).send('vendor not found');
    //         }
    //         const user = await User.findById(userId);
    
    //         if (!user) {
    //             return res.status(404).send('User not found');
    //         }
    
    //         // Create a new vendor record in the VerifiedVendor collection
    //         const newVendor = new VerifiedVendor({
    //             userRefs: vendorId, // Reference to the userProfession document
    //             userRef: userId, // Reference to the userProfession document
    //             verification_status: verification_status || 'Pending', // Default to 'Pending' if not provided
    //             profileImage: profileImage || user.profileImage, // Use the existing image if not updated
    //             imageType: imageType || user.imageType // Use the existing image type if not updated
    //             // Include other fields if necessary
    //         });
    
    //         // Save the new vendor record to the database
    //         await newVendor.save();
    
    //         // Redirect to vendors list or a success page
    //         res.redirect('/admin/vendors');
    //     } catch (error) {
    //         console.error('Error creating vendor:', error);
    //         res.status(500).send('An error occurred while creating the vendor. Please try again later.');
    //     }
    // },
    
        
adminVerifyvendor: async (req, res) => {
    try {
        const vendorId = req.params.id;
        const { verification_status, userId } = req.body;

        const profileImage = req.file ? req.file.buffer.toString('base64') : req.body.profileImage;
        const imageType = req.file ? req.file.mimetype : req.body.imageType;

        const vendor = await Profession.findById(vendorId);
        if (!vendor) {
            return res.status(404).send('vendor not found');
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newVendor = new VerifiedVendor({
            userRefs: vendorId,
            userRef: userId,
            verification_status: verification_status || 'Pending',
            profileImage: profileImage || user.profileImage,
            imageType: imageType || user.imageType
        });

        await newVendor.save();

        res.redirect('/admin/dashbord'); // was '/admin/vendors' — that route doesn't exist
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).send('An error occurred while creating the vendor. Please try again later.');
    }
},


        login: async (req, res) => {
            try {
                const { email, password, role } = req.body;
                console.log("req body", req.body);
        
                // Regex patterns for validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&<>^.,:;[\]{}()|~`#\-_/\\+=]{8,}$/;
        
                // Validate email and password format
                if (!emailRegex.test(email)) throw new Error("Invalid email format");
                if (!passwordRegex.test(password)) throw new Error("Invalid password format");
        
                // Handle Admin Login
                if (role === "admin") {
                    const loginAdmin = await Admin.login(email, password);
                    if (!loginAdmin) {
                        return res.status(400).json({ error: 'Invalid email or password' });
                    }
        
                    // Generate token and set session
                    const token = genAdmintoken(loginAdmin._id);
                    req.session.token = token;
                    req.session.adminId = loginAdmin._id;
        
                    return res.redirect('/admin/dashBord');
        
                // Handle User Login
                } else if (role === "user") {
                    const loginUser = await User.login(email, password);
                    if (!loginUser) {
                        return res.status(400).json({ error: 'Invalid email or password' });
                    }
        
                    // Generate token and set session
                    const token = genUserToken(loginUser._id);
                    req.session.token = token;
                    req.session.loginUserId = loginUser._id;
                    console.log("req user id",)
        
                    return res.redirect('/index/page');
        
                } else {
                    return res.status(400).json({ error: 'Invalid role' });
                }
            } catch (error) {
                console.error("Error in login handler:", error.message);  // Log the exact error
                res.status(500).json({ message: error.message });
            }
        },
        

      bookedVendor:async(req,res)=>{
        try {
            const { vendorId, userId, fName,lName } = req.body;
    
            // Ensure userId is not an array and doesn't contain empty strings
            const validUserId = Array.isArray(userId) ? userId.find(id => mongoose.Types.ObjectId.isValid(id)) : userId;
    
            if (!validUserId) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
    
            // Find the user by ID
            const user = await User.findById(validUserId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Find the vendor by ID
            const vendor = await VerifiedVendor.findById(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
    
            // Create the BookedVendor object
            const newBookedVendor = new BookedVendor({
                vendorRef: vendor._id,
                userRef: user._id,
                fName,lName 
            });
    
            // Save the BookedVendor to the database
            await newBookedVendor.save();
    
            res.status(201).json({ message: "Vendor booked successfully", bookedVendor: newBookedVendor });
        } catch (error) {
            res.status(500).json({ message: "An error occurred while booking the vendor", error: error.message });
        }
    },


uploadWorks: async (req, res) => {
    try {
        const { email, name } = req.body;

        // Validate input data
        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required.' });
        }

        // Handle profile image upload
        let profileImage = {};
        if (req.file) {
            profileImage.data = req.file.buffer;
            profileImage.contentType = req.file.mimetype;
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Find the corresponding profession by user ID
        const vendor = await Profession.findOne({ userRef: user._id });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found.' });
        }

        // Create the VendorWork document
        const vendorWork = new VendorWork({
            vendor: vendor._id,
            email,
            name,
            profileImage
        });

        await vendorWork.save();
        res.status(201).json(vendorWork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error. Could not create vendor work.' });
    }
}

    
      }
      
          
          
    

