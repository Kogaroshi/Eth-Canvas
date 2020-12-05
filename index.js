const fs = require('fs');
const { exec } = require('child_process');
const http = require('http');
const hostname = '127.0.0.1';
const port = 8080;

const path = require('path');

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

app.use(express.static(path.join(__dirname, "public")));

var server = app.listen(port, async () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});