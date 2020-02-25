/*
Bronson Schultz, bcs269, 11231230
CMPT 350, Assignment 2, Nodejs server
*/


// import the needed modules
const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3');

// create a new middleware server with express
const app = express();

// tell the app to write to the head of the HTML files
app.use(function (req, reponse, next) {
  reponse.writeHead(200, { 'Content-Type': 'text/plain'});
  next();
});


// Database set up
let db = new sqlite3.Database('A2.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to Assignment 2 DB');
});


/*
Public method to perform a database query
:param option: a JSON containing the query string for the database
:return: a private middleware function that transfers the query to the database
*/
var getInfo = function (option) {
 var opts = option || {};
 var query = opts.query || '';

 return function _getInfo(req, res, next) {
  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    var str = '';
    //for each row of data, stringify for writing to the server
    rows.forEach(function (row) {
      var tempJson = JSON.stringify(row);
      str = str + (tempJson + '\n');
    });
    res.write(str);
    res.end();
   });
   next(); // pass the control on to the next middleware function
 }
}


// on each route, specify what the database query string should be

app.use('/users', getInfo({query:'SELECT * FROM Users'}));
app.get('/users', function (req, res) {
});


app.use('/messages', getInfo({query:'SELECT * FROM Messages'}));
app.get('/messages', function (req, res) {
});


app.use('/likes', getInfo({query:'SELECT * FROM Likes'}));
app.get('/likes', function (req, res) {
});


app.use('/contacts', getInfo({query:'SELECT * FROM Contacts'}));
app.get('/contacts', function (req, res) {
});


// if the user goes to a page that doesn't exists, 404
app.get('*', function (req, res) {
    res.end("404 Page not found");
});


// launch the server on port 3000
http.createServer(app).listen(3000)
console.log("server running");
console.log("Go to: localhost:3000/users");
