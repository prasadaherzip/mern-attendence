const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const Student = require('../models/Student');

// POST /api/marks - Add marks for a student
router.post('/', async (req, res) => {
    try {
        const { studentId, subject, score, total, examType, examDate, remarks } = req.body;

        // Validation
        if (!studentId || !subject || score === undefined || total === undefined) {
            return res.status(400).json({ error: 'studentId, subject, score, and total are required' });
        }

        if (score < 0 || total < 1) {
            return res.status(400).json({ error: 'Invalid score or total marks' });
        }

        if (score > total) {
            return res.status(400).json({ error: 'Score cannot be greater than total marks' });
        }

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create or update marks
        const marks = await Marks.findOneAndUpdate(
            { studentId, subject, examType: examType || 'Internal' },
            { score, total, examDate, remarks: remarks || '' },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(201).json(marks);
    } catch (err) {
        console.error('Add marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/marks - Get all marks records with optional filters
router.get('/', async (req, res) => {
    try {
        const { studentId, subject, examType, minPercentage, maxPercentage } = req.query;
        const filter = {};

        if (studentId) filter.studentId = studentId;
        if (subject) filter.subject = subject;
        if (examType) filter.examType = examType;

        // Percentage range filter
        if (minPercentage || maxPercentage) {
            filter.percentage = {};
            if (minPercentage) filter.percentage.$gte = parseFloat(minPercentage);
            if (maxPercentage) filter.percentage.$lte = parseFloat(maxPercentage);
        }

        const marks = await Marks.find(filter)
            .populate('studentId', 'name roll class email')
            .sort({ examDate: -1, createdAt: -1 });

        return res.json(marks);
    } catch (err) {
        console.error('Get marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/marks/student/:studentId - Get marks for specific student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, examType } = req.query;

        const filter = { studentId };
        if (subject) filter.subject = subject;
        if (examType) filter.examType = examType;

        const marks = await Marks.find(filter)
            .populate('studentId', 'name roll class email')
            .sort({ examDate: -1, subject: 1 });

        // Calculate overall statistics
        const stats = {
            totalSubjects: marks.length,
            averagePercentage: marks.length > 0
                ? marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length
                : 0,
            totalScore: marks.reduce((sum, m) => sum + m.score, 0),
            totalMaxMarks: marks.reduce((sum, m) => sum + m.total, 0)
        };

        return res.json({ marks, stats });
    } catch (err) {
        console.error('Get student marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/marks/subject/:subject - Get marks for specific subject
router.get('/subject/:subject', async (req, res) => {
    try {
        const { subject } = req.params;
        const { examType } = req.query;

        const filter = { subject };
        if (examType) filter.examType = examType;

        const marks = await Marks.find(filter)
            .populate('studentId', 'name roll class email')
            .sort({ percentage: -1 });

        // Calculate subject statistics
        const stats = {
            totalStudents: marks.length,
            averagePercentage: marks.length > 0
                ? marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length
                : 0,
            highestPercentage: marks.length > 0 ? Math.max(...marks.map(m => m.percentage)) : 0,
            lowestPercentage: marks.length > 0 ? Math.min(...marks.map(m => m.percentage)) : 0
        };

        return res.json({ marks, stats });
    } catch (err) {
        console.error('Get subject marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/marks/:id - Update marks record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { score, total, examDate, remarks } = req.body;

        const updateData = {};
        if (score !== undefined) {
            if (score < 0) {
                return res.status(400).json({ error: 'Score cannot be negative' });
            }
            updateData.score = score;
        }
        if (total !== undefined) {
            if (total < 1) {
                return res.status(400).json({ error: 'Total marks must be at least 1' });
            }
            updateData.total = total;
        }
        if (examDate !== undefined) updateData.examDate = examDate;
        if (remarks !== undefined) updateData.remarks = remarks;

        const marks = await Marks.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('studentId', 'name roll class email');

        if (!marks) {
            return res.status(404).json({ error: 'Marks record not found' });
        }

        return res.json(marks);
    } catch (err) {
        console.error('Update marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/marks/:id - Delete marks record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Marks.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Marks record not found' });
        }

        return res.json({ ok: true, message: 'Marks record deleted successfully' });
    } catch (err) {
        console.error('Delete marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
