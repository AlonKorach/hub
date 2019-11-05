const express = require('express')
const app = express()
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser')
const fs = require('fs')
const firebase = require('firebase-admin')
const nodemailer = require('nodemailer')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStratgey = require("passport-local").Strategy;
const multer = require('multer');
const flash = require('connect-flash');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// Handle Sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , fromPage = root;

  }
}))

app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)



app.get('/', (req, res) => login_show(req, res));
app.post('/login_send', (req, res) => login_send(req, res))

function login_show(req,res){
    res.status(200).render("login.ejs")
}

function login_send(req, res){
  //Send the login details to the database
}

function indexPage(req, res) {
  if (!)
}

app.listen(8080)
