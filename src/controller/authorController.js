let authorModel = require("../model/authorModels");

let createAuthor = async (req, res) => {
    try {

        let data = req.body;

        let { fname, lname, title, email, password } = data;
        
        if (!fname) {
            return res.status(400).send({ msg: "First name is required" })
        }
        if (!lname) {
            return res.status(400).send({ msg: "Last name is required" })
        }
        if (!title) {
            return res.status(400).send({ msg: "Title is required" });
        };

        if (!email) {
            return res.status(400).send({ msg: "Email name is required" })
        }

        let emailIs = await authorModel.findOne({ email })
        if (emailIs) {
            return res.status(400).send({ msg: "Try another email is already used" })
        }

        if (!password) {
            return res.status(400).send({ msg: "Password is required" });
        }


        if (Object.keys(data).length != 0) {
            let saveData = await authorModel.create(data);
            res.status(201).send({ message: saveData, status: true })
        } else {
            res.status(400).send({ message: "BAD invalid request" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message })
    }
}


module.exports = { createAuthor }
