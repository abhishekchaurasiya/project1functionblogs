const jwt = require("jsonwebtoken");
const blogModel = require('../model/blogModels');
let authorModel = require("../model/authorModels");

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};


let auth1 = async (req, res, next) => {

    try {
        let token = req.headers["x-Api-key"];   // Check uppercase in headers
        if (!token) token = req.headers["x-api-key"];  // Check lowercase in headers

        if (!token) {
            return res.status(400).send({ message: "Token must be present", status: true })
        };

        let incodedToken = jwt.verify(token, "abhishek-project");

        if (!incodedToken) {
            return res.status(400).send({ status: false, message: "token is invalid" })
        }

    } catch (error) {
        return res.status(500).send({ message: error, Error: error.message })
    }
    next();
};



let auth2 = async (req, res, next) => {

    try {
        let userId = req.query.authorId;
        let token = req.headers["x-Api-key"];   // Check uppercase in headers
        if (!token) token = req.headers["x-api-key"];  // Check lowercase in 

        let decodedToken = jwt.verify(token, "abhishek-project");
        if (!decodedToken) return res.send({ status: false, msg: "token is not valid" });

        let loggedInUser = decodedToken.userId;
        if (userId != loggedInUser) {
            return res.status(400).send({ message: "User not authorized" })
        }

        let user = await authorModel.findById({ _id: userId });
        next();

    } catch (error) {
        return res.status(500).send({ message: error, Error: error.message })

    }

};


// Phase 2 Problem 2

const MiddlewareMid1 = async function (req, res, next) {
    try {
        let body = req.body

        let header = req.headers;
        let query = req.query.authorId

        let token = header['x-api-key'] || header["X-API-KEY"]

        let AuthorDetail = await authorModel.findOne({ $or: [{ email: body.email, password: body.password }, { _id: body.authorId }, { _id: query }] }).select({ _id: 1 });


        if (!AuthorDetail) {
            return res.status(404).send("Creadential are not matching")
        }

        let DecodeToken = jwt.verify(token, "abhishek-project")

        if (DecodeToken.authorId != AuthorDetail.Id) {

            return res.status(404).send("Token Error: could not validate the authorization ")
        }

        return next()

    }
    catch (err) {
        return res.status(403).send({ msg: "Error", error: err.message })
    }

};


const MiddlewareMid2 = async function (req, res, next) {

    let header = req.headers
    let token = header['x-api-key'] || header["X-API-KEY"]

    let bloggerVerification = await BloggerModel.findById(req.params.blogId)

    if (!bloggerVerification) {
        return res.status(404).send({ msg: "Error: Blog id does not exist" })
    }

    let AuthorDetail = await authorModel.findById(bloggerVerification.authorId).select({ _id: 1 });

    if (!AuthorDetail) {
        return res.status(404).send("Creadential are not matching")
    }

    let DecodeToken = jwt.verify(token, "Functionup-Team52")

    if (DecodeToken.authorId != AuthorDetail.id) {

        return res.status(404).send("Token Error: could not validate the authorization ")
    }

    return next()
}










module.exports = { auth1, auth2, MiddlewareMid1, MiddlewareMid2 }





