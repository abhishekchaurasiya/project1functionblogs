const jwt = require("jsonwebtoken");

let authorizationMiddleWare = async (req, res, next) => {

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

module.exports = { authorizationMiddleWare }





