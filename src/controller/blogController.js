const blogModel = require('../model/blogModels');
// let authorModel = require("../model/authorModels");


let createBlog = async (req, res) => {
    try {
        let blogData = req.body;

        let { title, body, authorId, tags, category, subcategory } = blogData;

    
        if (!title) {
            return res.status(400).send({ message: "Title is required" });
        };

        if (!body) {
            return res.status(400).send({ message: "body is required" });
        };

        if (!authorId) {
            return res.status(400).send({ message: "this author id not valid" });
        };

        if (!tags) {
            return res.status(400).send({ message: "Tags is required" });
        };

        if (!category) {
            return res.status(400).send({ message: "Category is required" });
        };

        if (!subcategory) {
            return res.status(400).send({ message: "Subcategory is required" });
        };

        // Return HTTP status 400 for an invalid request with a response body like

        if (Object.keys(blogData).length != 0) {
            let saveData = await blogModel.create(blogData);
            res.status(201).send({ message: saveData, status: true });
        } else {
            res.status(404).send({ message: "BAD invalid request" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message });
    }
};

// Get All data
let GetBlog = async (req, res) => {
    try {
        const { authorId, category, subcategory, tags } = req.query;

        if (!authorId) {
            return res.status(400).send({ message: "AuthorId is required" });
        };

        if (!category) {
            return res.status(400).send({ message: "Category is required" });
        };

        if (!subcategory) {
            return res.status(400).send({ message: "subcategory is required" });
        };

        if (!tags) {
            return res.status(400).send({ message: "tags is required" });
        };

        let getData = await blogModel.find({ authorId: authorId, category: category, subcategory: subcategory, tags: tags , isDeleted:false}).populate("authorId");

        if (!getData) {
            res.status(404).send({ message: "BAD invalid request" });
        } else {
            res.status(200).send({ message: getData, Status: true });
        }
    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message });
    }
};

// Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true

let updateBlogItems = async (req, res) => {

    // Update blog items first way
    // try {
    //     let data = req.params.blogId;

    //     if (!data) {
    //         return res.status(400).send({ message: "This user id in not valid" });
    //     }


    //     let bodyData = req.body;

    //     let getBlogData = await blogModel.findById(data).populate("authorId");

    //     Object.assign(getBlogData, bodyData, { isPublished: true });

    //     getBlogData.save({ $push: { tags: req.body.tags, subcategory: req.body.subcategory } });

    //     if (!getBlogData) {
    //         return res.status(400).send({ message: "BAD invalid request" });
    //     } else {
    //         return res.status(200).send({ message: getBlogData, Status: true });
    //     }
    // } catch (error) {
    //     res.status(500).send({ message: "Error", error: error.message });
    // }

    // Update blog items second way
    try {
        let data = req.body;
        let params = req.params;

        if (!params) {
            return res.status(400).send({ message: "this user id not valid" })
        }

        let getParamsId = await blogModel.findOne({ _id: params.blogId })

        if (!getParamsId) {
            return res.status(400).send({ message: "this user id not valid" })
        }

        // Destructuring all body data
        let { title, body, tags, subcategory } = data;

        if (!title) {
            return res.status(400).send({ messag: "title is required" })
        }

        if (!body) {
            return res.status(400).send({ messag: "body is required" })
        };

        if (!tags) {
            return res.status(400).send({ messag: "tags is required" })
        };

        if (!subcategory) {
            return res.status(400).send({ messag: "subcategory is required" })
        };

        // Here update collection data
        let updateAllData = await blogModel.findOneAndUpdate({ _id: params.blogId }, { $set: { title: title, body: body, isPublished: true, isDeleted: false }, $push: { tags: tags, subcategory: subcategory } }, { new: true }).populate("authorId")

        if (!updateBlogItems) {
            return res.status(404).send({ message: "Not valid " });

        } else {
            return res.status(200).send({ message: updateAllData });
        }

    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message });
    }

};

// Delete blog document with userId

let deleteBlog = async (req, res) => {
    try {

        let userId = req.params.userId;

        if (userId.length != 24) {
            return res.status(400).send({ message: "This user id not exists" })
        }

        let user = await blogModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ status: true, message: "This blog document doesn't exist" });
        } else {
            return res.status(201).send({ status: true, data: user });
        }

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};


// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

let deleteBlogByQuerParmas = async (req, res) => {
    try {

        let data = req.query;

        let { category, authorId, tags, subcategory, unPublished } = data;

        if (!category) {
            return res.status(400).send({ message: "Category is required" });
        };

        if (!authorId) {
            return res.status(400).send({ message: "AuthorId is required" });
        };

        if (!tags) {
            return res.status(400).send({ message: "Tags is required" });
        };

        if (!subcategory) {
            return res.status(400).send({ message: "Subcategory is required" });
        };

        let findBlogData = await blogModel.findOne(data);

        if (Object.keys(findBlogData) != 0) {
            let deleteData = await blogModel.updateOne({ data }, { $set: { isDeleted: true, isPublished: unPublished } }, { new: true });
            return res.status(200).send({ message: deleteData, status: true });
        } else {
            return res.status(404).send({ message: "This blog document does not exists." });
        }

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};






module.exports = { createBlog, GetBlog, updateBlogItems, deleteBlog, deleteBlogByQuerParmas };