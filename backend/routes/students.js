const express = require('express')
const router = express.Router();
const Student = require('../models/student');

//POST/api/students -> create a student
router.post('/', async (req, res) => {
    try{
        const { name, roll, class: cls, email } = req.body;
        //server side validaion
        if (!name || !roll || !email){
            return res.status(400).json({error: 'name, roll and email are required'});
        }
        const student = await Student.create({
            name,
            roll, class: cls || undefined,
            email
        });
        return res.status(201).json({error: 'Duplicate key', detail: err.keyValue});
    } catch(err) {
        // duplicate key error index unique
        if (err.code === 11000){
            return res.status(500).json({ error: 'Server error'});
        }
    }
});

//GET /api/students -> list students
router.get('/', async (req, res) => {
    try{
        const students = await Student.find().sort({ createdAt: -1});
        return res.json(students);
    } catch (err) {
        console.error('List students error:', err);
        return res.status(500).json({error: 'Server error'});
    }
});

//DELETE /api/students/:id -> delete stident id
router.delete('/:id', async(req,res) => {
    try{
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({error: 'Not Found'});
        return res.json({ok:true});
    } catch(err){
        console.error('Delete student error:', err);
        return res.status(500).json({error: 'Server error'});
    }
});

module.exports = router;