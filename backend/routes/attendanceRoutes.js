const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// POST /api/attendance - Mark attendance for a student
router.post('/', async (req, res) => {
    try {
        const { studentId, date, status, remarks } = req.body;

        // Validation
        if (!studentId || !date || !status) {
            return res.status(400).json({ error: 'studentId, date, and status are required' });
        }

        if (!['Present', 'Absent'].includes(status)) {
            return res.status(400).json({ error: 'Status must be either Present or Absent' });
        }

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create or update attendance
        const attendance = await Attendance.findOneAndUpdate(
            { studentId, date },
            { status, remarks: remarks || '' },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(201).json(attendance);
    } catch (err) {
        console.error('Mark attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/attendance - Get all attendance records with optional filters
router.get('/', async (req, res) => {
    try {
        const { studentId, date, startDate, endDate, status } = req.query;
        const filter = {};

        if (studentId) filter.studentId = studentId;
        if (date) filter.date = date;
        if (status) filter.status = status;

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = startDate;
            if (endDate) filter.date.$lte = endDate;
        }

        const attendance = await Attendance.find(filter)
            .populate('studentId', 'name roll class email')
            .sort({ date: -1, createdAt: -1 });

        return res.json(attendance);
    } catch (err) {
        console.error('Get attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/attendance/student/:studentId - Get attendance for specific student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        const filter = { studentId };

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = startDate;
            if (endDate) filter.date.$lte = endDate;
        }

        const attendance = await Attendance.find(filter)
            .populate('studentId', 'name roll class email')
            .sort({ date: -1 });

        return res.json(attendance);
    } catch (err) {
        console.error('Get student attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/attendance/date/:date - Get attendance for specific date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;

        const attendance = await Attendance.find({ date })
            .populate('studentId', 'name roll class email')
            .sort({ 'studentId.roll': 1 });

        return res.json(attendance);
    } catch (err) {
        console.error('Get date attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/attendance/:id - Update attendance record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        if (status && !['Present', 'Absent'].includes(status)) {
            return res.status(400).json({ error: 'Status must be either Present or Absent' });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (remarks !== undefined) updateData.remarks = remarks;

        const attendance = await Attendance.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('studentId', 'name roll class email');

        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        return res.json(attendance);
    } catch (err) {
        console.error('Update attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/attendance/:id - Delete attendance record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Attendance.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        return res.json({ ok: true, message: 'Attendance record deleted successfully' });
    } catch (err) {
        console.error('Delete attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
