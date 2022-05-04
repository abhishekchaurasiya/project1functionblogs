const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Blog title is required",
        trim: true
    },

    body: { type: String, required: "Body is required", trim: true },

    authorId: { type: ObjectId, ref: "Author", required: "Blog author is required" },  // strictPopulate,

    tags: [{
        type: String,
        trim: true
    }],

    category: { type: String, required: "Blog category is required", trim: true },

    subcategory: [{
        type: String,
        trim: true
    }],

    isPublished: { type: Boolean, default: false },

    publishedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },

    deletedAt: { type: Date, default: null },


}, { tiemstamps: true });

module.exports = mongoose.model("Blog", blogSchema);



