const express = require('express');
const router = express.Router();
const Export = require('../models/Export');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Student = require('../models/Student');

// Helper function to convert data to CSV format
const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row =>
        headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
};

// POST /api/export/attendance - Generate attendance report
router.post('/attendance', async (req, res) => {
    try {
        const { startDate, endDate, studentId, class: className, format } = req.body;

        // Create export record
        const exportRecord = await Export.create({
            exportType: 'attendance',
            format: format || 'CSV',
            filters: { startDate, endDate, studentId, class: className },
            status: 'processing'
        });

        try {
            // Build query
            const query = {};
            if (studentId) query.studentId = studentId;
            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = startDate;
                if (endDate) query.date.$lte = endDate;
            }

            // Fetch attendance data
            let attendanceData = await Attendance.find(query)
                .populate('studentId', 'name roll class email')
                .sort({ date: -1 });

            // Filter by class if specified
            if (className) {
                attendanceData = attendanceData.filter(a =>
                    a.studentId && a.studentId.class === className
                );
            }

            // Format data for export
            const formattedData = attendanceData.map(a => ({
                Date: a.date,
                'Student Name': a.studentId?.name || 'N/A',
                'Roll Number': a.studentId?.roll || 'N/A',
                Class: a.studentId?.class || 'N/A',
                Status: a.status,
                Remarks: a.remarks || ''
            }));

            // Generate CSV
            const csvData = convertToCSV(formattedData,
                ['Date', 'Student Name', 'Roll Number', 'Class', 'Status', 'Remarks']
            );

            // Update export record
            exportRecord.status = 'completed';
            exportRecord.recordCount = attendanceData.length;
            exportRecord.fileSize = Buffer.byteLength(csvData, 'utf8');
            await exportRecord.save();

            // Return CSV data directly
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${Date.now()}.csv`);
            return res.send(csvData);

        } catch (error) {
            exportRecord.status = 'failed';
            exportRecord.errorMessage = error.message;
            await exportRecord.save();
            throw error;
        }

    } catch (err) {
        console.error('Export attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/export/marks - Generate marks report
router.post('/marks', async (req, res) => {
    try {
        const { studentId, subject, examType, class: className, format } = req.body;

        // Create export record
        const exportRecord = await Export.create({
            exportType: 'marks',
            format: format || 'CSV',
            filters: { studentId, subject, class: className, examType },
            status: 'processing'
        });

        try {
            // Build query
            const query = {};
            if (studentId) query.studentId = studentId;
            if (subject) query.subject = subject;
            if (examType) query.examType = examType;

            // Fetch marks data
            let marksData = await Marks.find(query)
                .populate('studentId', 'name roll class email')
                .sort({ examDate: -1, subject: 1 });

            // Filter by class if specified
            if (className) {
                marksData = marksData.filter(m =>
                    m.studentId && m.studentId.class === className
                );
            }

            // Format data for export
            const formattedData = marksData.map(m => ({
                'Student Name': m.studentId?.name || 'N/A',
                'Roll Number': m.studentId?.roll || 'N/A',
                Class: m.studentId?.class || 'N/A',
                Subject: m.subject,
                'Exam Type': m.examType,
                Score: m.score,
                Total: m.total,
                'Percentage': m.percentage.toFixed(2),
                'Exam Date': m.examDate || 'N/A',
                Remarks: m.remarks || ''
            }));

            // Generate CSV
            const csvData = convertToCSV(formattedData,
                ['Student Name', 'Roll Number', 'Class', 'Subject', 'Exam Type', 'Score', 'Total', 'Percentage', 'Exam Date', 'Remarks']
            );

            // Update export record
            exportRecord.status = 'completed';
            exportRecord.recordCount = marksData.length;
            exportRecord.fileSize = Buffer.byteLength(csvData, 'utf8');
            await exportRecord.save();

            // Return CSV data directly
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=marks_report_${Date.now()}.csv`);
            return res.send(csvData);

        } catch (error) {
            exportRecord.status = 'failed';
            exportRecord.errorMessage = error.message;
            await exportRecord.save();
            throw error;
        }

    } catch (err) {
        console.error('Export marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/export/performance/:studentId - Generate student performance report
router.post('/performance/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate, format } = req.body;

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create export record
        const exportRecord = await Export.create({
            exportType: 'performance',
            format: format || 'CSV',
            filters: { studentId, startDate, endDate },
            status: 'processing'
        });

        try {
            // Fetch attendance data
            const attendanceQuery = { studentId };
            if (startDate || endDate) {
                attendanceQuery.date = {};
                if (startDate) attendanceQuery.date.$gte = startDate;
                if (endDate) attendanceQuery.date.$lte = endDate;
            }
            const attendanceData = await Attendance.find(attendanceQuery).sort({ date: 1 });

            // Fetch marks data
            const marksData = await Marks.find({ studentId }).sort({ subject: 1, examType: 1 });

            // Calculate attendance statistics
            const totalDays = attendanceData.length;
            const presentDays = attendanceData.filter(a => a.status === 'Present').length;
            const attendancePercentage = totalDays > 0 ? (presentDays / totalDays * 100).toFixed(2) : 0;

            // Calculate marks statistics
            const avgPercentage = marksData.length > 0
                ? (marksData.reduce((sum, m) => sum + m.percentage, 0) / marksData.length).toFixed(2)
                : 0;

            // Format performance report
            const reportData = [
                { Field: 'Student Name', Value: student.name },
                { Field: 'Roll Number', Value: student.roll },
                { Field: 'Class', Value: student.class },
                { Field: 'Email', Value: student.email },
                { Field: '', Value: '' },
                { Field: 'ATTENDANCE SUMMARY', Value: '' },
                { Field: 'Total Days', Value: totalDays },
                { Field: 'Present Days', Value: presentDays },
                { Field: 'Absent Days', Value: totalDays - presentDays },
                { Field: 'Attendance %', Value: attendancePercentage },
                { Field: '', Value: '' },
                { Field: 'MARKS SUMMARY', Value: '' },
                { Field: 'Total Subjects', Value: marksData.length },
                { Field: 'Average Percentage', Value: avgPercentage },
                { Field: '', Value: '' },
                { Field: 'SUBJECT-WISE MARKS', Value: '' }
            ];

            // Add subject-wise marks
            marksData.forEach(m => {
                reportData.push({
                    Field: `${m.subject} (${m.examType})`,
                    Value: `${m.score}/${m.total} (${m.percentage.toFixed(2)}%)`
                });
            });

            // Generate CSV
            const csvData = convertToCSV(reportData, ['Field', 'Value']);

            // Update export record
            exportRecord.status = 'completed';
            exportRecord.recordCount = 1;
            exportRecord.fileSize = Buffer.byteLength(csvData, 'utf8');
            await exportRecord.save();

            // Return CSV data directly
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=performance_${student.roll}_${Date.now()}.csv`);
            return res.send(csvData);

        } catch (error) {
            exportRecord.status = 'failed';
            exportRecord.errorMessage = error.message;
            await exportRecord.save();
            throw error;
        }

    } catch (err) {
        console.error('Export performance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/export/history - Get export history
router.get('/history', async (req, res) => {
    try {
        const { exportType, status, limit } = req.query;
        const filter = {};

        if (exportType) filter.exportType = exportType;
        if (status) filter.status = status;

        const exports = await Export.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) || 50);

        return res.json(exports);
    } catch (err) {
        console.error('Get export history error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/export/:id - Get export details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const exportRecord = await Export.findById(id);
        if (!exportRecord) {
            return res.status(404).json({ error: 'Export record not found' });
        }

        return res.json(exportRecord);
    } catch (err) {
        console.error('Get export details error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
