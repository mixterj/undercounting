// undercounting.js

// set up express application
var express = require('express');
var app = express();
var fs = require('fs');

// configuration
var config = {};

config.server = "sanmateo-32.dev.oclc.org";
config.port = 3073;

config.jsonPath = "/media/3tb/Projects/undercounting/app/organizations/";

config.httpStatus = "200";

config.contentTypes = {};
config.contentTypes.json = "application/json";
config.contentTypes.jsonld = "application/ld+json";
config.contentTypes.plain = "text/plain";
config.contentTypes.html = "text/html";


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

//callback function for all responses
function sendResponse(res,obj) {
  res.writeHead(obj.status, { "Content-Type": obj.contentType });
  res.write(obj.json);
  res.end();
}
  
//run a local application
 function runApp(req,res,config,callback) {

    var pythonScript = "";
    var orgID = ""; 
    if (req.query.hasOwnProperty("id")) {
        
        orgID = req.query.id;
        console.log(orgID);
        pythonScript = config.jsonPath + orgID + "/" + req.query.task + ".py";
      
        var exec = require('child_process').exec;
        
        // object to hold response properties
        var obj = {};
        obj.contentType = config.contentTypes.json;
        obj.status = "200";
        obj.json = "{}";
        
        // run the child process
        var stdout = "";
        var diagnostics = "";
        var childProcess = "python "+pythonScript + " org_id=" + req.query.id + ' date_search=' + req.query.date_search;
        console.log(childProcess);
        console.log(obj.contentType);
        var child = exec(childProcess, {maxBuffer: 2048 * 500});
        child.stdout.on('data', function(data) {
      	  console.log('stdout data received')
      	  stdout += data;
      	});
      	child.stderr.on('data', function(data) {
      	  console.log('stderr data received')
      	  data = data.replace(/\"/gi, "");
      	  data = data.replace(/\n/gi, " ");
      	  data = data.replace(/\r/gi, " ");
      	  data = data.substring(data.indexOf('Error:')+7);
      	  diagnostics = "{ \"error\": \""+data+"\" }";
      	});
      	child.on('close', function() {
      	  console.log('child process closed')
      	  console.log(stdout)
      	  if (stdout.length > 0) {
      	    obj.json = stdout;
      	  } else {
      	    obj.status = '500';
      	    obj.contentType = "application/json";
      	    obj.json = diagnostics;
      	  }
      	  sendResponse(res,obj);
      	});
      }  
    else {
      sendResponse(res,config.errorObject["500"]);
    }
    
  } // end runApp
 
//object to hold response properties
 var obj = {};
 obj.contentType = config.contentTypes.json;
 obj.status = "200";
 obj.json = "{}";
 
//Handle entity api request patterns
 app.get('/', function (req, res) {

   // look for a query parameter named "id"
   if (req.query.hasOwnProperty("id")) {
     runApp(req,res,config,sendResponse);
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