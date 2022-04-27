const express = require('express');

const router = express.Router();

const { createAuthor } = require("../controller/authorController");
const { createBlog, GetBlog} = require('../controller/blogController');


// API for createAuthor
router.post("/authors", createAuthor)

// API for create blogs
router.post("/blogs", createBlog);
router.get("/blogs", GetBlog);




module.exports = router;