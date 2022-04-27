const express = require('express');

const router = express.Router();

const { createAuthor } = require("../controller/authorController");
const { createBlog } = require('../controller/blogController');


// API for createAuthor
router.post("/authors", createAuthor)

// API for create blogs
router.post("/blogs", createBlog)


module.exports = router;