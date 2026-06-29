const VerifiedVendor = require("../model/veryfiedVendor");
const User=require("../model/userModel")

module.exports={
    homePage:async(req,res)=>{
        res.render("welcomePage")
    },
   indexPagePage:async(req,res)=>{
     try {
        const loginUser=req.user
        console.log("loged in user",loginUser)
        const findUser=await User.findById(loginUser._id)
        if(!findUser)return console.log("user not found")
            console.log("user logging in",findUser)
          // Fetch verified vendors
            const response = await fetch(`http://localhost:3000/admin/find/verified/vendor`);
            const verifiedVendors = await response.json();
            console.log("verfied vevdor",verifiedVendors)
            console.log("vendor count:", verifiedVendors?.vendors?.length);
console.log("first vendor image length:", verifiedVendors?.vendors?.[0]?.profileImage?.length);
console.log("first vendor imageType:", verifiedVendors?.vendors?.[0]?.imageType);
        
        res.render("index",{user:findUser,
            verifiedVendors


        })
     } catch (error) {
        console.log("error",error)
        res.status(500).json({
            message:error.message
        })
        
     }
    },
    vendorUploadedWorkPage:async(req,res)=>{
        
        res.render("uploadWorks")
    },
    vendorWorkPage: async (req, res) => {
        try {
            const email = req.query.email;
            const response = await fetch(`http://localhost:3000/api//find/vendor/uploaded/works?email=${email}`);
            const data = await response.json();
            
            if (!data || !data.vendorWorks || data.vendorWorks.length === 0) { 
                console.log("No vendor works found", data);
                return res.render("workPage", { vendorWorks: null });
            }
    
            // Log the entire array of vendor works
            console.log("Vendor works data:", data.vendorWorks);
    
            // Pass the array of vendorWorks to the EJS template
            res.render("workPage", { vendorWorks: data.vendorWorks });
        } catch (error) {
            console.error("Error fetching vendor works:", error);
            res.status(500).send("Error fetching vendor works.");
        }
    },
    
   
    indexPage: async (req, res) => { 
        try {
            const user = req.loginUser;
            console.log("user in req", user);
 
    
            // Fetch booked vendors
            const response1 = await fetch(`http://localhost:3000/admin/find/booked/vendor`);
            const bookedVendors = await response1.json();
            console.log("booked vendor",bookedVendors) 
    
            // Fetch verified vendors
            const response = await fetch(`http://localhost:3000/admin/find/verified/vendor`);
            const verifiedVendors = await response.json();
            console.log("verfied vevdor",verifiedVendors)
    
            // Map vendorRef to their ratings
            const vendorRatings = {};
            if (bookedVendors && bookedVendors.vendors) {
                bookedVendors.vendors.forEach(bookedVendor => {
                    console.log("bookedVendor:", bookedVendor); // Log the entire object for inspection
                    const vendorId = bookedVendor.vendorRef && bookedVendor.vendorRef._id ? bookedVendor.vendorRef._id.toString() : null;
                    const rating = bookedVendor.rating;
                    console.log("log rating", rating, "vendorId:", vendorId);
                    if (rating && rating > 2 && vendorId) {
                        vendorRatings[vendorId] = rating;
                        console.log("vendor rating assigned id", vendorRatings[vendorId]);
                    }
                });
            }
        //    const
            console.log("Vendor ratings:", vendorRatings); // Log the ratings for debugging
    
            res.render("index", {
                user,
                vendors: verifiedVendors.vendors,
                vendorRatings
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).send("Server error");
        }
    },
    
    
    
    
    
    loginUser:(req,res)=>{
        res.render("./userView/userLogin")

    },
    loginAdmin:(req,res)=>{
        res.render("./adminView/adminLogin")

    },
    userReg:(req,res)=>{
       
        res.render("./userView/userRegistration")
    },
    clientBookVendor: async(req,res)=>{
        const vendorId=req.query.id;
        const userId=req.query.userId;
        const response= await fetch(`http://localhost:3000/admin/find/verified/vendor?id=${vendorId}`)
        const data=await response.json()
        if(!data){
        console.log("empty data",data.status);
        
        }
        console.log("client book vendor in req ",data.vendor)
       
        res.render("bookVendor",{vendor:data.vendor,userId:userId})
    },
    regProfession: async(req,res)=>{
       const userId=req.query.id;
       const response= await fetch(`http://localhost:3000/find/user/in/vendor/page?id=${userId}`)
       const data=await response.json()
       if(!data){
       console.log("empty data",data.status);
       
       }
       console.log("user ",data.user)
       
        res.render("./userView/regprofession",{user:data.user})
    },
    adminDashBord:async(req,res)=>{
        const response=await fetch(`http://localhost:3000/admin/find/registered/vendor/page`)
        const data=await response.json()
        const response2=await fetch(`http://localhost:3000/admin/find/registered/user`)
        const data2=await response2.json()
        if(!data &&!data2){
            console.log("empty data",data.status);
            
            }
            console.log("reg vendor ",data.vendors)
            console.log("reg user in fetch ",data2)
        

        res.render("./adminView/dashbord",{regUsers:data2.users,regVendors:data.vendors})
    },
    adminRegPage:(req,res)=>{
        res.render("./adminView/adminRegistration")
    },
    viewVendors:async(req,res)=>{

        const response=await fetch(`http://localhost:3000/admin/find/registered/vendor/page`)
        const data=await response.json()
        if(!data ){
            console.log("empty data",data.status);
          
            
            }
            console.log("reg vendor ",data.vendors)
 
        
        res.render("./adminView/regvendors",{regVendor:data.vendors})
    },
    adminVerifyVendorPage: async (req, res) => {
        try {
            const vendorId = req.query.id;
            const response = await fetch(`http://localhost:3000/admin/find/registered/vendor/page?id=${vendorId}`);
            const data = await response.json();
    
            if (!data || !data.vendor) {
                console.log("No vendor data found");
                return res.status(404).send("Vendor not found");
            }
    
            console.log("Veryfied vendor in req data:", data.vendor);
            res.render("./adminView/verifiedVendor", { vendor: data.vendor });
        } catch (error) {
            console.error("Error fetching vendor data:", error);
            res.status(500).send("Internal Server Error");
        }
    }, 
   bookedVendors: async (req, res) => {
        try {
            
            const response = await fetch(`http://localhost:3000/admin/find/booked/vendor`);
            const data = await response.json();
    
            if (!data || !data.vendors) {
                console.log("No vendor data found");
                return res.status(404).send("Vendor not found");
            }
    
            console.log(" booked Vendor data:", data.vendors);
            res.render("./adminView/bookedVendor", { bookedVendorsvendor:data.vendors });
        } catch (error) {
            console.error("Error fetching vendor data:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    adminVerifiedVendors: async (req, res) => {
        try {
           
            const response = await fetch(`http://localhost:3000/admin/find/verified/vendor`);
            const data = await response.json();
    
            if (!data || !data.vendors) {
                console.log("No vendor data found");
                return res.status(404).send("Vendor not found");
            }
    
            console.log("verified Vendor data:", data.vendors);
            res.render("./adminView/verifiedVendors", { VerifiedVendor:data.vendors }); 
        } catch (error) {
            console.error("Error fetching vendor data:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    updateVendor:async(req,res)=>{
        try {
            const bookedVendorId = req.query.id;
            const response = await fetch(`http://localhost:3000/admin/find/booked/vendor?id=${bookedVendorId}`);
            const data = await response.json();
    
            if (!data || !data.vendor) {
                console.log("No vendor data found");
                return res.status(404).send("Vendor not found");
            }
    
            console.log("Booked vendor data in update page:", data.vendor);
            res.render("./adminView/updateVendor", { vendor: data.vendor });
    
        } catch (error) {
            console.error("Error fetching vendor data:", error);  
            res.status(500).send("Internal Server Error");
        }

    }
}