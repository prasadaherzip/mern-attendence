const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['English', 'Maths', 'OS', 'MIS', 'SEPM'],
        trim: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 1
    },
    percentage: {
        type: Number,
        default: function () {
            return (this.score / this.total) * 100;
        }
    },
    examType: {
        type: String,
        enum: ['Internal', 'External', 'Assignment', 'Project', 'Final'],
        default: 'Internal'
    },
    examDate: {
        type: String, // YYYY-MM-DD format
        trim: true
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

// Create compound index to prevent duplicate marks for same student, subject, and exam type
MarksSchema.index({ studentId: 1, subject: 1, examType: 1 }, { unique: true });

// Calculate percentage before saving
MarksSchema.pre('save', function (next) {
    if (this.total > 0) {
        this.percentage = (this.score / this.total) * 100;
    }
    next();
});

module.exports = mongoose.model('Marks', MarksSchema);
