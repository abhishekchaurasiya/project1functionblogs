const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true,
        // strictPopulate
    },
    tags: [String],
    category: {
        type: String,
        required: true,
    },
    subcategory: [String],
    deletedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { tiemstamps: true });

module.exports = mongoose.model("Blog", blogSchema);


 
