const express = require('express');

const router = express.Router();

// Author Details
const { createAuthor } = require("../controller/authorController");

// Blog Details
const { createBlog, GetBlog, updateBlogItems, deleteBlog, deleteBlogByQuerParmas } = require('../controller/blogController');

// Login Controller
const { loggedInUser } = require("../controller/loginController")

// Check Creadentail and Authorization from middle ware
const { authorizationMiddleWare } = require("../middleware/authorizationMid")

// API for createAuthor
router.post("/authors", createAuthor)

// API for create blogs
router.post("/blogs", authorizationMiddleWare, createBlog);

router.get("/blogs", authorizationMiddleWare, GetBlog);

router.put("/blogs/:blogId", authorizationMiddleWare, updateBlogItems);

router.delete("/blogs/:userId", authorizationMiddleWare, deleteBlog);

router.delete("/blogs", authorizationMiddleWare, deleteBlogByQuerParmas);

// Login user 
router.post("/login", loggedInUser)



module.exports = router;