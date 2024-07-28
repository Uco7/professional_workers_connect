const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const Admin=require("../../model/admin")
const Staff=require("../../model/staff")
require('dotenv').config();




const genUsertoken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('User token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};
const verifyUserToken = async (req, res, next) => {
  const token = req.session.token; // Retrieve the token from session
  const userId = req.session.userId; // Retrieve the user ID from session

  if (!token) {
    return res.redirect('/login/page'); // Redirect if no token
  }

  if (!userId) {
    console.log('No user ID found in session.');
    return res.redirect('/login/page'); // Redirect if no user ID
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('User token verified successfully', decoded);

    const user = await User.findById(userId); // Fetch user data
    if (!user) {
      return res.status(404).send('User not found.');
    }
    req.user = user; // Attach user data to req.user
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }}

const genAdmintoken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('User token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};
const verifyAdminToken = async (req, res, next) => {
  const token = req.session.token; // Retrieve the token from session
  const adminId = req.session.adminId; // Retrieve the admin ID from session

  if (!token) {
   return res.redirect('/login/page');
  }
 
  if (!adminId) {
    console.log('No admin ID found in session.');
    return res.redirect('/login/page'); // Redirect if no user ID
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Admin token verified successfully', decoded);

    const admin = await Admin.findById(adminId) // Fetch admin data excluding the password
    if (!admin) {
      return res.status(404).send('Admin not found.');
    }
    req.loginAdmin = admin; // Attach admin data to req.loginAdmin
    next();
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};
// module.exports = (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).send('Unable to logout');
//     }
//     res.redirect('/login'); // Redirect to login page
//   });
// };

const genStafftoken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('User token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};
const verifyStaffToken = async (req, res, next) => {
  const token = req.session.token; // Retrieve the token from session
  const loginStaff = req.session.staffId; // Retrieve the admin ID from session

  if (!token) {
   return res.redirect('/login/page');
  }
 
  if (!loginStaff) {
    console.log('No staff ID found in session.');
    return res.redirect('/login/page'); // Redirect if no user ID
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Admin token verified successfully', decoded);

    const staff = await Staff.findById(loginStaff) // Fetch staff data throw id
    if (!staff) {
      return res.status(404).send('staff not found.');
    }
    req.loginStaff = staff; // Attach admin data to req.loginAdmin
    next();
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

module.exports = { genUsertoken, verifyUserToken,genAdmintoken,verifyAdminToken,genStafftoken,verifyStaffToken };
