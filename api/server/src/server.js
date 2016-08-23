'use strict'
let test = (process.argv[2] == 'test');
if (test) {
    let path = require('path');
    let envFile = path.resolve(__dirname, "./.test-env");
    require('dotenv').config({ path: envFile });
} else {
    require('dotenv').load();
}


const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes');

const config = require('./shared/config');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.session_secret, resave: true, saveUninitialized: false }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use('/apidoc', express.static('../apidoc'));

// mount all routes on /api path
app.use('/api', routes);

const port = 5005;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});



process.on('uncaughtException', function (err) {
    console.log('uncaughtException');
    console.log(err);
})

module.exports = app;