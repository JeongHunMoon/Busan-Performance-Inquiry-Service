var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var app = express();

app.use(express.static('publci_data'));

var app = http.createServer(function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;
  
  if(pathName ==='/') {
    if(queryData.id === undefined) {
        response.writeHead(200, {"Content-Type":"text/html"});
        fs.createReadStream("./index.html").pipe(response);
       
    }
  }
});

app.listen(3010);