const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Create compound index to prevent duplicate attendance for same student on same date
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
