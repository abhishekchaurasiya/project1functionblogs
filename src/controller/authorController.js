let authorModel = require("../model/authorModels");
let jwt = require("jsonwebtoken");


const isValid = function (value) {

    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss", "Mast"].indexOf(title) !== -1;
};

const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

let createAuthor = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidReqestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameter. Please provide author details" });
            return
        }

        // Object Destructuring 
        let { fname, lname, title, email, password } = requestBody;

        // Validation is starts
        if (!isValid(fname)) {
            res.status(400).send({ status: false, msg: "First name is required" });
            return
        }
        if (!isValid(lname)) {
            res.status(400).send({ status: false, msg: "Last name is required" });
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "Title is required" });
            return
        };

        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, msg: "Title should be among Mr, Mrs, Miss and Mast" });
            return
        };

        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is required" })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
            res.status(400).send({ status: false, message: "Please provide valid email" })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Password is required" });
            return
        }

        let emailIsAllreadyUsed = await authorModel.findOne({ email })  //  {email:email} object shorthand property
        if (emailIsAllreadyUsed) {
            res.status(400).send({ status: false, msg: `${email} Try another email is already used` });
            return
        }

        // Validation is End 

        const authorData = { fname, lname, title, email, password }
        const newAuthor = await authorModel.create(authorData);

        res.status(201).send({ status: true, message: "Author created successfully", data: newAuthor })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const loginAuthor = async (req, res) => {
    try {
        let requestBody = req.body;

        if (!isValidReqestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameter. Please provide login details" });
            return
        }

        // Extract params
        const { email, password } = requestBody;

        // validation starts is here
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is required" });
            return
        };

        if (!isValid((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email))) {
            res.status(400).send({ status: false, message: "Please provide valid email address" })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Password is required" });
            return
        }
        // Validation ends

        const author = await authorModel.findOne({ email, password });

        if (!author) {
            res.status(400).send({ status: false, message: "Invalid login credential" });
            return
        }

        let token = await jwt.sign({
            authorId: author._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, "someeverysecuredprivatekey2022abhishek@(%*637#$^@()73)(#$%^)");

        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: "Author login successfully", data: { token } })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createAuthor, loginAuthor }
