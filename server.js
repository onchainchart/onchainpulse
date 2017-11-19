'use strict';

const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

// app.set('view engine', 'pug');
app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));

let port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Start server on port ${port}`));