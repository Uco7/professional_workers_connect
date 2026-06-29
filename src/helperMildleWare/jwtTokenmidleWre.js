const jwt = require('jsonwebtoken');
const User = require("../model/userModel");
const Admin = require("../model/adminmodel");
const Staff = require("../model/staffModel"); // adjust path if your staff model lives elsewhere
require('dotenv').config();

const genUserToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('User token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

const verifyUserToken = async (req, res, next) => {
  const token = req.session.token;
  const userId = req.session.loginUserId; // matches what login() sets

  if (!token) {
    return res.redirect('/login/page');
  }

  if (!userId) {
    console.log('No user ID found in session.');
    return res.redirect('/login/page');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('User token verified successfully', decoded);

    const loginUser = await User.findById(userId);
    if (!loginUser) {
      return res.status(404).send('User not found.');
    }
    req.user = loginUser;
    console.log("req use//r",req.user)
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

const genAdmintoken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('Admin token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

const verifyAdminToken = async (req, res, next) => {
  const token = req.session.token;
  const adminId = req.session.adminId;

  if (!token) {
    return res.redirect('/login/page');
  }

  if (!adminId) {
    console.log('No admin ID found in session.');
    return res.redirect('/login/page');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Admin token verified successfully', decoded);

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).send('Admin not found.');
    }
    req.loginAdmin = admin;
    next();
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

const genStafftoken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('Staff token generated', token);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

const verifyStaffToken = async (req, res, next) => {
  const token = req.session.token;
  const staffId = req.session.staffId;

  if (!token) {
    return res.redirect('/login/page');
  }

  if (!staffId) {
    console.log('No staff ID found in session.');
    return res.redirect('/login/page');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Staff token verified successfully', decoded);

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).send('Staff not found.');
    }
    req.loginStaff = staff;
    next();
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

module.exports = { genUserToken, verifyUserToken, genAdmintoken, verifyAdminToken, genStafftoken, verifyStaffToken };