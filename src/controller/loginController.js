const blogModel = require('../model/blogModels');
let authorModel = require("../model/authorModels");
let jwt = require("jsonwebtoken");

// Login user api

let loggedInUser = async (req, res) => {
    try {
        let userEmail = req.body.email
        let userPassword = req.body.password;


        let userDetails = await authorModel.findOne({ email: userEmail, password: userPassword });
        if (!userDetails) {
            return res.status(400).send({ message: "your username and password is not correct" });
        }

        let token = jwt.sign({
            userId: userDetails._id.toString(),
            batch: "Project1 create blog website",
            organization: "abhishek group member",
        }, "abhishek-project");

        if (!token) {
            return res.status(400).send({ message: "Not valid token" });
        } else {
            res.status(200).setHeader("x-api-key", token);
            return res.status(200).send({ message: token, status: true });
        }

    } catch (error) {
        return res.status(500).send({ message: error, Error: error.message })
    }
}

module.exports = { loggedInUser }