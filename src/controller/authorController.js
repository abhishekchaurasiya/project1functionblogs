let authorModel = require("../model/authorModels");

let createAuthor = async (req, res) => {
    try {
        let data = req.body;
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
