let mongoose = require('mongoose');

let authorSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    title: { type: String, enum: ["Mr", "Mrs", "Miss"] },
    email: { type: String, required: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema);

