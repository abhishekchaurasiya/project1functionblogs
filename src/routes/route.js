const express = require('express');

const router = express.Router();

// Author Details
const { createAuthor } = require("../controller/authorController");

// Blog Details
const { createBlog, GetBlog, updateBlogItems, deleteBlog, deleteBlogByQuerParmas } = require('../controller/blogController');

// Login Controller
const { loggedInUser } = require("../controller/loginController")

// Check Creadentail and Authorization from middle ware
const { auth1, auth2, MiddlewareMid1 } = require("../middleware/authorizationMid")


// API for createAuthor
router.post("/authors", createAuthor)

// API for create blogs
router.post("/blogs", auth1, MiddlewareMid1, createBlog);

router.get("/blogs", auth1, auth2, GetBlog);

router.put("/blogs/:blogId", auth1, updateBlogItems);

router.delete("/blogs/:userId", auth1, deleteBlog);

router.delete("/blogs", auth1, deleteBlogByQuerParmas);

// Login user 
router.post("/login", loggedInUser);



module.exports = router;