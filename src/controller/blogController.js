
const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
const blogModel = require('../model/blogModels');
let authorModel = require("../model/authorModels");
const { param } = require('../routes/route');

const isValid = function (value) {

    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}

const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidObjectId = function (objectId) {
    return ObjectId.isValid(objectId)
}

let createBlog = async (req, res) => {
    try {
        let requestBody = req.body;

        if (isValidReqestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameter. Please provide author details" });
            return
        }

        // Extract Params
        let { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;

        // Validation start is here
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" });
        };

        if (!isValid(body)) {
            return res.status(400).send({ status: false, message: "body is required" });
        };

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, message: "this author id not valid" });
        };

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: "this author id not valid" });
        };

        if (!isValid(tags)) {
            return res.status(400).send({ status: false, message: "Tags is required" });
        };

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Blog category is required" });
        };

        const author = await authorModel.findById(authorId);
        if (!author) {
            res.status(400).send({ status: false, message: "Author does not exit" });
            return
        }
        // Validation ends

        let blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }

        if (tags) {
            if (Array.isArray(tags)) {
                blogData['tags'] = [...tags]
            }
            if (Object.prototype.toString.call(tags) === "[object string]") {
                blogData["tags"] = [tags]
            }
        }

        if (subcategory) {
            if (Array.isArray(subcategory)) {
                blogData['subcategory'] = [...subcategory]
            }
            if (Object.prototype.toString.call(subcategory) === "[object string]") {
                blogData["subcategory"] = [subcategory]
            }
        }

        let newBlog = await blogModel.create(blogData);
        res.status(201).send({ status: true, message: "New blog created successfully", data: newBlog });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// Get All data
let GetBlog = async (req, res) => {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true };
        const queryParams = req.query;

        if (isValidReqestBody(queryParams)) {
            const { authorId, category, subcategory, tags } = queryParams;

            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery["authorId"] = authorId;
            };

            if (isValid(category)) {
                filterQuery["category"] = category.trim()
            };

            if (isValid(tags)) {
                let tagsArry = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all: tagsArry }
            };

            if (isValid(subcategory)) {
                let subCategoryArry = subcategory.trim().split(',').map(tag => tag.trim());
                filterQuery['subcategory'] = { $all: subCategoryArry }
            };
        }

        const blogs = await blogModel.find(filterQuery);

        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(400).send({ status: false, messag: "No blogs found" })
            return
        }

        res.status(200).send({ status: true, message: "Blogs list", data: blogs })

    } catch (error) {
        return res.status(500).send({ message: "Error", error: error.message });
    }
};

// Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true

let updateBlog = async (req, res) => {

    // Update blog items second way
    try {
        const requestBody = req.body;
        const params = req.params;
        const blogId = params.blogId;
        const authorIdFromToken = req.authorId;

        // Validation start 
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, messag: `${blogId} is not a valid blog id` })
            return
        };
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, messag: `${authorIdFromToken} is not a valid token id` })
            return
        };

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null });

        if (!blog) {
            res.status(400).send({ status: false, message: "Blog not found", })
            return
        }

        if (blog.authorId.toString() != authorIdFromToken) {
            res.status(401).send({ status: false, message: "Unauthorized access! Owner info doesn't match", })
            return

        }

        if (!isValidReqestBody(requestBody)) {
            res.status(200).send({ status: true, message: "No parameters passed. Blog unmodified", data: blog })

        }

        let { title, body, tags, subcategory, isPublished } = requestBody;

        const updateBlogData = [];

        // Destructuring all body data

        if (isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}
            updateBlogData['$set']['title'] = title
        };

        if (isValid(body)) {
            if (!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}
            updateBlogData['$set']['body'] = body
        };

        if (isValid(category)) {
            if (!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}
            updateBlogData['$set']['category'] = category
        };

        if (isPublished != undefined) {
            if (!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}
            updateBlogData['$set']['isPublished'] = isPublished
            updateBlogData['$set']['isPublished'] = isPublished ? new Date() : null
        }

        if (tags) {
            if (!Object.prototype.hasOwnProperty.call(updateAllData, '$addToSet')) updateBlogData['$addToSet'] = {}
            if (Array.isArray(tags)) {
                updateBlogData['$addToset']['tags'] = { $each: [...tags] }
            }
            if (typeof tags === 'string') {
                updateBlogData['$addToset']['tags'] = tags
            }
        }

        if (subcategory) {
            if (!Object.prototype.hasOwnProperty.call(updateBlogData, '$addToSet')) updateBlogData['$addToSet'] = {}
            if (Array.isArray(tags)) {
                updateBlogData['$addToset']['subcategory'] = { $each: [...subcategory] }
            }
            if (typeof tags === 'string') {
                updateBlogData['$addToset']['subcategory'] = subcategory
            }
        }

        const updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, updateBlogData, { new: true });

        res.status(200).send({ status: true, messag: 'Blog updated successfully', data: updateBlog })

    } catch (error) {
        res.status(500).send({ status: false, message: "Error", error: error.message });
    }
};

// Delete blog document with userId

let deleteBlogById = async (req, res) => {
    try {
        const params = req.params;
        const blogId = params.blogId;
        const authorIdFromToken = req.authorId;

        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, messag: `${blogId} is not a valid blog id` })
            return
        }

        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, messag: `${authorIdFromToken} is not a valid token id` })
            return
        }

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null });
        if (!blog) {
            res.status(400).send({ status: false, messag: "Blog not found" })
            return
        }

        if (blogId.authorId.toString() != authorIdFromToken) {
            res.status(400).send({ status: false, messag: "Unauthorized access! Owne info doesn't match" })
        };

        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } });
        res.status(200).send({ status: true, message: "Blog deleted successfully" })

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};


// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

let deleteBlogByQuerParmas = async (req, res) => {
    try {

        const filterQuery = { isDeleted: false, deletedAt: null };
        const queryParams = req.query;
        const authorIdFromToken = req.authorId

        if (!isValidReqestBody(queryParams)) {
            res.status(400).send({ status: false, messag: `${queryParams} No query params received. Aborting delete operation` })
            return
        }

        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, messag: `${authorIdFromToken} is not a valid token id` })
            return
        }
        ;
        const { authorId, category, tags, subcategory, isPublished } = queryParams;

        if (isValidReqestBody(queryParams)) {

            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery["authorId"] = authorId;
            };

            if (isValid(category)) {
                filterQuery["category"] = category.trim()
            };

            if (isValid(isPublished)) {
                filterQuery["isPublished"] = isPublished
            }

            if (isValid(tags)) {
                let tagsArry = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all: tagsArry }
            };

            if (isValid(subcategory)) {
                let subCategoryArry = subcategory.trim().split(',').map(tag => tag.trim());
                filterQuery['subcategory'] = { $all: subCategoryArry }
            };
        }

        const blogs = await blogModel.find(filterQuery);

        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(400).send({ status: false, messag: "No blogs found" })
            return
        }

        const idOfBlogsToDelete = blogs.map(blog => {
            if (blog.authorId.toString() === authorIdFromToken) return blog._id;
        })

        if (idOfBlogsToDelete.length === 0) {
            res.status(400).send({ status: false, messag: "No blogs found" })
        }

        await blogModel.updateMany({ _id: { $in: idOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(400).send({ status: true, messag: "Blogs deleted successfully" })

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};





module.exports = { createBlog, GetBlog, updateBlog, deleteBlogById, deleteBlogByQuerParmas };