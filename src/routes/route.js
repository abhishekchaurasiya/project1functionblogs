const express = require('express');

const router = express.Router();

const { createAuthor } = require("../controller/authorController");
const { createBlog, GetBlog, updateBlogItems, deleteBlog, deleteBlogByQuerParmas } = require('../controller/blogController');


// API for createAuthor
router.post("/authors", createAuthor)

// API for create blogs
router.post("/blogs", createBlog);

router.get("/blogs", GetBlog);

router.put("/blogs/:blogId", updateBlogItems);

router.delete("/blogs/:userId", deleteBlog);

router.delete("/blogs", deleteBlogByQuerParmas);





module.exports = router;