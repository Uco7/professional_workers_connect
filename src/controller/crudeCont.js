const User=require("../model/userModel");
const Admin=require("../model/adminmodel")
const Profession=require("../model/professionModel")
const BookedVendor=require("../model/bookedVendor")
const VerifiedVendor=require("../model/veryfiedVendor")
const  VendorWork=require("../model/vendorWorks")
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'); // added — needed for ObjectId.isValid below


module.exports={
    findUser: async(req,res)=>{
        try {
            const userId = req.query.id;

            if (!userId || userId === "undefined" || !mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    status: "failed",
                    message: "No valid user id provided"
                });
            }

            const user = await User.findById(userId);

            if (user) {
                console.log("user found", user);
                return res.status(200).json({
                    status: "success",
                    user
                });
            } else {
                return res.status(404).json({
                    status: "failed",
                    message: "user not found"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: error.message || "internal server error"
            });
        }
    },
    // ...rest of your file (adminFindRegUsers, adminFindVendor, findVerifiedVendor,
    // findBookedVendor, findVendorByEmail, findVendorWorks, adminUpdteVendor,
    // deleteRegVendor, deleteBookedVendor) — unchanged, exactly as you pasted them.
    adminFindRegUsers:async(req,res)=>{
        try {
            if(req.query.id){
                const userId=req.query.id
                const user=await User.findById(userId);
                if(user){
                    console.log("single user",user);
                    res.status(200).json({
                        status:"success",
                        user
                    })
                }
                else{
                    console.log("user not found");
                    
                }
            }else{

                const users = await User.find();
            if (users) {
                console.log("reg users", users);
                return res.status(200).json({
                    status:"success",
                    users
                })
               
            }
            }
            
        } catch (error) {
            console.log("error", error);
            res.status(500).json({
                message: "internal server error" || error
            });
        }
    },
    adminFindVendor:async(req,res)=>{
    
    
    try {
        if(req.query.id){
            const vendorId=req.query.id
            const vendor=await Profession.findById(vendorId).populate("userRef");
            if(vendor){
                console.log("single vendor",vendor);
                res.status(200).json({
                    status:"success",
                    vendor
                })
            }
            else{
                console.log("vendor not found");
                
            }
        }else{

            const vendors  = await Profession.find().populate("userRef");
        if (vendors) {
            console.log("reg  vendor", vendors);
            return res.status(200).json({
                status:"success",
                vendors
            })
           
        }
        }
        
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "internal server error" || error
        });
    }
},
findVerifiedVendor:async(req,res)=>{
    
    
    try {
        const vendorId = req.query.id;
    
        if (vendorId) {
            const vendor = await VerifiedVendor.findById(vendorId).populate("userRefs")
                .populate({
                    path: 'userRefs',
                      select: 'fName lName email address job_title Years_of_experience qualification skills_tools bio'
                 
                })
                .populate({
                  
                        path: 'userRef',
                       
                    
                });
    
            console.log("Vendor data:", vendor); // Add this to check data
    
            if (vendor) {
                res.status(200).json({
                    status: "success",
                    vendor
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "Verified vendor not found"
                });
            }
        } else {
            const vendors = await VerifiedVendor.find()
                .populate({
                    path: 'userRef',
                
                })
                .populate({
                    path: 'userRefs',
                    select: 'fName lName email address job_title Years_of_experience qualification skills_tools bio'

                    
                });
    
            console.log("Vendors data:", vendors); // Add this to check data
    
            if (vendors) {
                res.status(200).json({
                    status: "success",
                    vendors
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "No verified vendors found"
                });
            }
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
    
},
findBookedVendor:async(req,res)=>{
    
    try {
        if (req.query.id) {
            const bookedVendorId = req.query.id;
            const vendor = await BookedVendor.findById(bookedVendorId)
            .populate({
                path: 'vendorRef',
                populate: {
                    path: 'userRefs',  // This should match the field name in VerifiedVendor
                    select: 'fName lName email address job_title Years_of_experience qualification skills_tools bio date_of_birth'
                }
            })
            .populate({
                path: 'userRef',
                select: 'fName lName email phone_no'
            });
        
            if (vendor) {
                console.log("Verified vendor", vendor);
                res.status(200).json({
                    status: "success",
                    vendor
                });
            } else {
                console.log("Verified vendor not found");
                res.status(404).json({
                    status: "fail",
                    message: "Vendor not found"
                });
            }
        } else {
            const vendors = await BookedVendor.find()
                .populate("vendorRef")
                .populate("userRef");

            if (vendors) {
                console.log("Verified vendors", vendors);
                return res.status(200).json({
                    status: "success",
                    vendors
                });
            } else {
                res.status(404).json({
                    status: "fail",
                    message: "No vendors found"
                });
            }
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server error" || error
        });
    }
},
findVendorByEmail: async(req,res)=>{
    try {
        const { email } = req.body;

        // Step 1: Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found.");
            return res.status(404).json({
                status: "User not found"
            });
        }

        // Step 2: Find the verified vendor by userRef
        const vendor = await VerifiedVendor.findOne({ userRef: user._id });
        if (!vendor) {
            console.log("Verified vendor not found.");
            return res.status(404).json({
                status: "Verified vendor not found"
            });
        }

        console.log("Verified vendor found:", vendor);
        res.render("uploadWorks",{vendor})

    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

},
findVendorWorks:async(req,res)=>{
    if (req.query.email) {
        try {
            const email = req.query.email;
            // Use find() to retrieve all works related to the vendor's email
            const vendorWorks = await VendorWork.find({ email });
            
            if (vendorWorks && vendorWorks.length > 0) {
                res.status(201).json({
                    status: "success",
                    vendorWorks // Return all vendor works
                });
            } else {
                console.log("No vendor works found");
                res.status(404).json({
                    status: "404 error: resource not found"
                });
            }
            
        } catch (error) {
            console.log("error", error);
            res.status(500).json({
                message: "internal server error" || error
            });
        }
    } else {
        console.log("Error: no req.query.email URL parameter provided");
        res.status(400).json({
            status: "400 error: Bad request, no email provided"
        });
    }
    

    },
    adminUpdteVendor: async (req, res) => {
        try {
            const bookedVendorId = req.params.id;  
            console.log("booked vendor id:", req.params.id);
            const { userId, rating, fName, lName, email, phone_no, address, job_title, Years_of_experience, qualification, skills_tools, bio, date_of_birth } = req.body;
    
            // Find the booked vendor
            const vendor = await BookedVendor.findById(bookedVendorId);
    
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
    
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update the root-level fields fName and lName on the BookedVendor document
            vendor.fName = fName || vendor.fName;
            vendor.lName = lName || vendor.lName;
    
            // Update the vendorRef fields if vendorRef exists
            if (vendor.vendorRef) {
                vendor.vendorRef.email = email || vendor.vendorRef.email;
                vendor.vendorRef.phone_no = phone_no || vendor.vendorRef.phone_no;
                vendor.vendorRef.address = address || vendor.vendorRef.address;
                vendor.vendorRef.job_title = job_title || vendor.vendorRef.job_title;
                vendor.vendorRef.Years_of_experience = Years_of_experience || vendor.vendorRef.Years_of_experience;
                vendor.vendorRef.qualification = qualification || vendor.vendorRef.qualification;
                vendor.vendorRef.skills_tools = skills_tools || vendor.vendorRef.skills_tools;
                vendor.vendorRef.bio = bio || vendor.vendorRef.bio;
                vendor.vendorRef.date_of_birth = date_of_birth || vendor.vendorRef.date_of_birth;
            }
    
            // Update the rating
            vendor.rating = rating || vendor.rating;
    
            // Update profile image if provided
            if (req.file && req.file.buffer) {
                vendor.vendorRef.profileImage = req.file.buffer.toString('base64');
                vendor.vendorRef.imageType = req.file.mimetype;
            }
    
            await vendor.save();
    
            // Send an email to the vendor
            await sendEmailToVendor({
                fName, lName, email, userEmail: user.email, userfName: user.fName, userlName: user.lName, userphone_no: user.phone_no, userAddress: user.address
            });
    
            res.status(200).json({ message: "Vendor updated successfully" });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'The email provided is already in use. Please use a different email.' });
            } else {
                return res.status(500).json({ message: 'An error occurred while updating the vendor profile', error: error.message });
            }
        }
    },
    


deleteRegVendor : async (req, res) => {
        try {
            const { id } = req.params; // Profession ID from route params
    
            // Find and delete profession
            const deletedProfession = await Profession.findByIdAndDelete(id);
    
            if (!deletedProfession) {
                return res.status(404).json({ message: "Profession not found" });
            }
    
            res.status(200).json({
                status: "success",
                message: "Profession deleted successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error" || error.message
            });
        }
    },
deleteBookedVendor : async (req, res) => {
        try {
            const { id } = req.params; // Profession ID from route params
    
            // Find and delete profession
            const deletedVendor = await BookedVendor.findByIdAndDelete(id);
    
            if (!deletedVendor) {
                return res.status(404).json({ message: "Profession not found" });
            }
    
            res.status(200).json({
                status: "success",
                message: "Profession deleted successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error" || error.message
            });
        }
    }

}
async function sendEmailToVendor({ fName, lName, email, userEmail, userfName, userlName, userphone_no, userAddress }) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Your Vendor Profile has been Updated`,
            html: `
                <h1>Hello, ${fName} ${lName}!</h1>
                <p>You received this email because of the profession or skill you offer.</p>
                <p>Online professional workers connect is informing you of the client that just contacted you for your expertise.</p>
                <h4>Client contact details are seen below:</h4>
                <ul>
                    <li>Client Name: ${userfName} ${userlName}</li>
                    <li>Client Email: ${userEmail}</li>
                    <li>Client Phone Number: ${userphone_no}</li>
                </ul>
                <p>If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br>Your Company</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent to vendor:', email);

    } catch (error) {
        console.error('Error sending email to vendor:', error);
        throw new Error('Failed to send email to vendor');
    }
}
