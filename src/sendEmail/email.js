// server.js
const express = require('express');
const connectDB = require('./db');  // Import the database connection
const nodemailer = require('nodemailer');
const path = require('path');
const Email = require('./email');  // Import the Email model

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve the HTML form
app.use(express.static(path.join(__dirname, 'public')));
app.get('/email',(req,res)=>{
  res.render('email')
})
app.get('/',(req,res)=>{
  res.render('index')
})

app.post('/send-email', async (req, res) => {
    const { name, email, message, subject } = req.body;
    const sentAt = new Date();

    // Save the initial data to MongoDB
    const newEmail = new Email({ name, email, message, subject, sentAt, status: 'pending' });
    await newEmail.save();

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Render the email template with EJS
    app.render('emailTemplate', { name, message }, async (err, html) => {
        if (err) {
            newEmail.status = 'failed';
            await newEmail.save();
            return res.status(500).send(err.toString());
        }

        // Define email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: html,
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
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
