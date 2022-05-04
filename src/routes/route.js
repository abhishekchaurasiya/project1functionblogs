const express = require('express');

const router = express.Router();

// Author Details
const { createAuthor, loginAuthor } = require("../controller/authorController");

// Blog Details
const { createBlog, GetBlog, updateBlog, deleteBlogById, deleteBlogByQuerParmas } = require('../controller/blogController');

// Check Creadentail and Authorization from middle ware
const { autherAuth } = require("../middleware/authorizationMid")


// API for author routes
router.post("/authors", createAuthor)
router.post("/login", loginAuthor);

// API for blogs routes
router.post("/blogs", autherAuth, createBlog);

router.get("/blogs", autherAuth, GetBlog);

router.put("/blogs/:blogId", autherAuth, updateBlog);

router.delete("/blogs/:blogId", autherAuth, deleteBlogById);

router.delete("/blogs", autherAuth, deleteBlogByQuerParmas);

// Login user 



module.exports = router;