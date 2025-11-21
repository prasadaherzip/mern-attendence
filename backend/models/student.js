const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name:{
        type: String,       
        required: true,     //must be provided
        trim: true          // remove leading and trailing spaces
    },
    roll: {
        type: String,
        unique: true,       //create unique index
        required: true,
        trim: true,
        uppercase: true      
    },
    class: {
        type: String,
        required: true,
        default:"FYMCA",
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowsercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email'] //something@something.something for searching emails
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
      

module.exports= mongoose.model('Student', StudentSchema);

