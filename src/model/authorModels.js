let mongoose = require('mongoose');

let authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: "First name is required",
        trim: true
    },
    lname: {
        type: String,
        required: "Last name is required",
        trim: true
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: "Title is required"
    },
    email: {
        type: String,
        required: "Email is required",
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: "Please fill a valid email address", isAsnyc: false
        }
    },
    password: {
        type: String,
        required: 'Password is required',
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema, 'authors');

