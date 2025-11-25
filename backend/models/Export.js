const mongoose = require('mongoose');

const ExportSchema = new mongoose.Schema({
    exportType: {
        type: String,
        enum: ['attendance', 'marks', 'performance', 'student_list'],
        required: true
    },
    format: {
        type: String,
        enum: ['CSV', 'PDF', 'JSON'],
        default: 'CSV'
    },
    filters: {
        startDate: {
            type: String, // YYYY-MM-DD
            trim: true
        },
        endDate: {
            type: String, // YYYY-MM-DD
            trim: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        class: {
            type: String,
            trim: true
        },
        subject: {
            type: String,
            trim: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    filePath: {
        type: String,
        trim: true
    },
    fileSize: {
        type: Number, // in bytes
        default: 0
    },
    recordCount: {
        type: Number,
        default: 0
    },
    errorMessage: {
        type: String,
        trim: true
    },
    requestedBy: {
        type: String,
        trim: true,
        default: 'admin'
    }
}, {
    timestamps: true
});

// Index for faster queries
ExportSchema.index({ exportType: 1, status: 1 });
ExportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Export', ExportSchema);
