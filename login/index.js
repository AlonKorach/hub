const express = require('express');
app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const ejsLint = require('ejs-lint');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);
app.set('views', __dirname)
app.set('scripts', `${__dirname}/scripts`);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));

// parse application/json
app.use(bodyParser.json())

app.get('/', indexPage); // TO DO: Create the indexPage function.
app.get('/in', inFunc)
app.get('/userinfo', userInfo)
app.get('/editUser', editUser)

function indexPage(req, res) {
  res.render("login.ejs")
}

function inFunc(req, res) {
  res.render("test.ejs");
}

function userInfo(req, res) {
  res.render("userinfo.ejs")
}

function editUser(req, res) {
  res.render("editUser.ejs", {edit: true})
}

app.listen(3000);
