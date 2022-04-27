const blogModel = require('../model/blogModels');
let authorModel = require("../model/authorModels");


let createBlog = async (req, res) => {
    try {
        let blogData = req.body;
        let authorId = blogData.authorId;

        // check valid authorid
        let author = await authorModel.findById(authorId);
        if (!author) {
            res.send({ message: "Not Valid ObjectId" });
        }

        // Return HTTP status 400 for an invalid request with a response body like
        if (Object.keys(blogData).length != 0) {
            let saveData = await blogModel.create(blogData);
            res.status(201).send({ message: saveData, status: true });
        }else{
            res.status(400).send({ message: "BAD invalid request"});
        }
        
    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message });
    }
}


module.exports = { createBlog }