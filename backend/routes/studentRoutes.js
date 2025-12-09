const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /api/students -> create a student
router.post('/', async (req, res) => {
    try {
        const { name, roll, class: cls, email } = req.body;

        // server side validation
        if (!name || !roll || !email) {
            return res.status(400).json({ error: 'Name, roll and email are required' });
        }

        const student = await Student.create({
            name,
            roll,
            class: cls || undefined,
            email,
            marks: [
                { subject: 'English', score: 0, total: 100 },
                { subject: 'Maths', score: 0, total: 100 },
                { subject: 'OS', score: 0, total: 100 },
                { subject: 'MIS', score: 0, total: 100 },
                { subject: 'SEPM', score: 0, total: 100 }
            ]
        });

        return res.status(201).json(student);
    } catch (err) {
        // duplicate key error index unique
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Student with this Roll or Email already exists' });
        }
        console.error('Create student error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/students -> list students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        return res.json(students);
    } catch (err) {
        console.error('List students error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/students/:id -> delete student
router.delete('/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Not Found' });
        return res.json({ ok: true });
    } catch (err) {
        console.error('Delete student error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/students/attendance -> mark attendance
router.put('/attendance', async (req, res) => {
    try {
        const { studentId, date, status } = req.body;

        if (!studentId || !date || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if attendance for this date already exists
        const existingIndex = student.attendance.findIndex(a => a.date === date);
        if (existingIndex > -1) {
            // Update existing
            student.attendance[existingIndex].status = status;
        } else {
            // Add new
            student.attendance.push({ date, status });
        }

        await student.save();
        return res.json(student);

    } catch (err) {
        console.error('Mark attendance error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/students/marks -> add/update marks
router.put('/marks', async (req, res) => {
    try {
        const { studentId, subject, score, total } = req.body;

        if (!studentId || !subject || score === undefined || total === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if mark for this subject already exists
        const existingIndex = student.marks.findIndex(m => m.subject === subject);
        if (existingIndex > -1) {
            // Update existing
            student.marks[existingIndex].score = score;
            student.marks[existingIndex].total = total;
        } else {
            // Add new
            student.marks.push({ subject, score, total });
        }

        await student.save();
        return res.json(student);

    } catch (err) {
        console.error('Add marks error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;