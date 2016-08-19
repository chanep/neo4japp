const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').load();

const config = require('../shared/config');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.cookieParser('secret-intl-skills-cloud'));
app.use(express.session({secret: config.session.secret}));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use('/apidoc', express.static('apidoc'));

// mount all routes on /api path
app.use('/api', routes);

const port = 5005;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = app;