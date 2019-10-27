const path = require('path');
const http = require('http');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));

server.listen(port, (err) => {
    console.log(`App is up on localhost:${port}`);
});
