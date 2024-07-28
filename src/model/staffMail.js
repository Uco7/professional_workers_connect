const mongoose=require('mongoose');

const emailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    sender_email: { type: String, required: true },
    message: { type: String, required: true },
    subject: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' }
});

const StaffMail = mongoose.model('staffEmail', emailSchema);

module.exports = StaffMail;

