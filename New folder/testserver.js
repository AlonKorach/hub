const express = require('express');
const app = express();
var fs = require('fs');
const bodyPraser = require('body-parser');
app.use(bodyPraser.json());
let ejs = require('ejs')
app.use(bodyPraser.urlencoded({ extended: true }));
const drinks =  require('../js_drinks/drinks_class.js');

app.get("/test.dat",function(req,res){
  var handler = new drinks.stats_handler(__dirname+"/drinks.txt",__dirname+"/serialization.txt")

  res.send({stat_values:handler.stats_ar ,stat_names: handler.ser_ar} )
})
app.get("/test.js",function(req,res){
  res.sendFile(__dirname+"/test.js")
})
app.get("/test.css",function(req,res){
  res.sendFile(__dirname+"/test.css")
})
app.get("/*",function(req,res){
  res.sendFile(__dirname+"/test.html")
})
app.listen(3000)
