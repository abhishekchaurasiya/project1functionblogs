const express = require('express');
const bodyParser = require('body-parser');

const route = require('./router/route');
const mongoose = require('mongoose');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect("mongodb+srv://mongoabhishek:JGETcKMFq8k1RFrV@cluster0.nn6fz.mongodb.net/Project1blogs?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('mongo is connected'))
    .catch(error => console.log(error))


app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});