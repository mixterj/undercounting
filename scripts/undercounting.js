// undercounting.js

// set up express application
var express = require('express');
var app = express();
var fs = require('fs');

// configuration
var config = {};

config.server = "sanmateo-32.dev.oclc.org";
config.port = 3072;

config.jsonPath = "/media/3tb/Projects/undercounting/app/organizations/";

config.httpStatus = "200";

config.contentTypes = {};
config.contentTypes.json = "application/json";
config.contentTypes.jsonld = "application/ld+json";
config.contentTypes.plain = "text/plain";
config.contentTypes.html = "text/html";

config.cacheControl = 'public, max-age=86400';

config.errorObject = {};
config.errorObject["200"] = {};
config.errorObject["200"].status = "200";
config.errorObject["200"].allow = "GET";
config.errorObject["200"].json = "{ \"status\": \"OK\" }";
config.errorObject["200"].contentType = config.contentTypes.json;
config.errorObject["400"] = {};
config.errorObject["400"].status = "400";
config.errorObject["400"].allow = "GET";
config.errorObject["400"].json = "{ \"error\": \"invalid request\" }";
config.errorObject["400"].contentType = config.contentTypes.json;
config.errorObject["401"] = {};
config.errorObject["401"].status = "401";
config.errorObject["401"].allow = "GET";
config.errorObject["401"].json = "{ \"error\": \"unauthorized\" }";
config.errorObject["401"].contentType = config.contentTypes.json;
config.errorObject["404"] = {};
config.errorObject["404"].status = "404";
config.errorObject["404"].allow = "GET";
config.errorObject["404"].json = "{ \"error\": \"resource not found\" }";
config.errorObject["404"].contentType = config.contentTypes.json;
config.errorObject["405"] = {};
config.errorObject["405"].status = "405";
config.errorObject["405"].allow = "GET";
config.errorObject["405"].json = "{ \"error\": \"unsupported method\" }";
config.errorObject["405"].contentType = config.contentTypes.json;
config.errorObject["406"] = {};
config.errorObject["406"].status = "406";
config.errorObject["406"].allow = "GET";
config.errorObject["406"].json = "{ \"error\": \"not acceptable\" }";
config.errorObject["406"].contentType = config.contentTypes.json;
config.errorObject["500"] = {};
config.errorObject["500"].status = "500";
config.errorObject["500"].json = "{ \"error\": \"system error\" }";
config.errorObject["500"].contentType = config.contentTypes.json;

config.cors = {};
config.cors.enabled = true;
config.cors.sites = "*";
config.cors.headers = "origin, content-type, accept";

// callback function for all responses
function sendResponse(res,obj) {
  res.writeHead(obj.status, { "Content-Type": obj.contentType });
  res.write(obj.json);
  res.end();
}

app.use(express.bodyParser());

app.all('/*', function(req, res, next) {
  if (config.cors.enabled) {
    res.header("Access-Control-Allow-Origin", config.cors.sites);
    res.header("Access-Control-Allow-Headers", config.cors.headers);
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);
  next();
});

// handle posts
app.post('/', function(req, res){
  var jsonData = req.body;
  console.log(jsonData);
  var jsonString = JSON.stringify(jsonData,null,2)
  if (jsonData.hasOwnProperty("id")) {
    var jsonFile = config.jsonPath + jsonData.id + ".json";
    fs.writeFile(jsonFile, jsonString, function(err) {
      if(err) {
        return console.log(err);
        sendResponse(res,config.errorObject["500"]);
      }
       sendResponse(res,config.errorObject["200"]);
    }); 
  } else {
    sendResponse(res,config.errorObject["400"]);
  }
});

// If no route is matched by now, it must be an invalid request
app.use(function(req, res) {
  sendResponse(res,config.errorObject["400"]);
});

app.listen(config.port);
console.log("Listening on "+config.port);