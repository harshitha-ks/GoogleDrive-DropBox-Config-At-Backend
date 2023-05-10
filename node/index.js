
const express = require('express');
const app = express();
const dropBoxRoute = require('./dropbox-router')
const googleDriveRoute = require('./google-router')
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors())

app.use('/', dropBoxRoute);
app.use('/', googleDriveRoute);

app.listen(4000, () => console.log('App listening on 8080'));