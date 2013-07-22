#!/usr/bin/env node
var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');
var inputFile = fs.readFileSync('code/index.html').toString();
console.log(inputFile);

app.get('/', function(request, response) {
  response.send(inputFile);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
})
