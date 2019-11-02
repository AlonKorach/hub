const express = require('express');
app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const admin = require('firebase-admin');
const FB = require('./FBKS');
const path = require('path');
const ejsLint = require('ejs-lint');
let barman = "";

app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));

// parse application/json
app.use(bodyParser.json())

app.get('/', indexPage);

app.get('/busyWait', busyWait);

app.post('/barmenUpdate', barmenUpdate);

app.get("/add", add);

app.get('/*', error404);
function busyWait(req, res) {
  if (barman == "") {
    res.status(500).send("Nan");
    return;
  }
  if (Array.isArray(barman["Sunday"])){
      getB(barman);
  }

  res.status(200).send(barman);
  return;

}
// Temp - Del me!
function add(req, res){
  let FBKS = new FB(admin, require('./hubks-b0507-firebase-adminsdk-t8hxc-741d85cc26'), 'hubks-b0507')
  FBKS.addDBRow("barmen/Sunday/h1", "1", "ak");
  FBKS.addDBRow("barmen/Sunday/h2", "1", "ak1");
  FBKS.addDBRow("barmen/Sunday/shiftmanager", "1", "akm")

  FBKS.addDBRow("barmen/Monday/h1", "1", "ak23");
  FBKS.addDBRow("barmen/Monday/h2", "1", "gal");
  FBKS.addDBRow("barmen/Monday/shiftmanager", "1", "may")

  FBKS.addDBRow("barmen/Tuesday/h1", "1", "ggg");
  FBKS.addDBRow("barmen/Tuesday/h2", "1", "!3");
  FBKS.addDBRow("barmen/Tuesday/shiftmanager", "1", "dsads")

  FBKS.addDBRow("barmen/Wednesday/h1", "1" , "Gal1");
  FBKS.addDBRow("barmen/Wednesday/h2", "1", "itm");
  FBKS.addDBRow("barmen/Wednesday/shiftmanager", "1", "sm")

  FBKS.addDBRow("barmen/Thursday/h1", "1", "323a");
  FBKS.addDBRow("barmen/Thursday/h2", "1", "a1");
  FBKS.addDBRow("barmen/Thursday/shiftmanager", "1", "b42")
  res.status(200).send("1");
}

function getBarmen(){
  let FBKS = new FB(admin, require('./hubks-b0507-firebase-adminsdk-t8hxc-741d85cc26'), 'hubks-b0507')

  FBKS.readDBItems("barmen").then( (snapshot) => {
      barman = snapshot.val();
  })
}

function getB(barmen){
  barman = {};

  barman[0] = [barmen["Sunday"]["h1"]];
  barman[0] += [barmen["Sunday"]["h2"]];

  barman[1] = [barmen["Monday"]["h1"]];
  barman[1] += [barmen["Monday"]["h2"]];

  barman[2] = [barmen["Tuesday"]["h1"]];
  barman[2] += [barmen["Tuesday"]["h2"]];

  barman[3] = [barmen["Wednesday"]["h1"]];
  barman[3] += [barmen["Wednesday"]["h2"]];

  barman[4] = [barmen["Thursday"]["h1"]];
  barman[4] += [barmen["Thursday"]["h2"]];
}

function indexPage(req, res) {
  getBarmen();
  res.status(200).render("../index.ejs", {barman: barman});
}

function barmenUpdate(req, res) {
  let FBKS = new FB(admin, require('./hubks-b0507-firebase-adminsdk-t8hxc-741d85cc26'), 'hubks-b0507');

  let barMan1;
  let barMan2;
  let sm;

  let length = Object.values(barman["Sunday"]).length + Object.values(barman["Monday"]).length + Object.values(barman["Thursday"]).length + Object.values(barman["Tuesday"]).length + Object.values(barman["Wednesday"]).length
  for (let i = 0; i < 5; i++ ){

    if (i == 0) {
      barMan1 = [];
      barMan2 = []
      sm = []
      let days = {
        1: "Sunday",
        2: "Monday",
        3: "Tuesday",
        4: "Wednesday",
        5: "Thursday",
      }

      for (let j = 1; j < 6; j++){
        barMan1.push(req.body[Object.keys(barman[days[j]]["h1"])]);
        barMan2.push(req.body[Object.keys(barman[days[j]]["h2"])]);
        sm.push(req.body[Object.keys(barman[days[j]]["shiftmanager"])])
      }
    }

    FBKS.updateDBRow(`barmen/${barMan1[i][1].split("_")[0]}/h1`, {[barMan1[i][0]]: barMan1[i][1].split("_")[1]});
    FBKS.updateDBRow(`barmen/${barMan2[i][1].split("_")[0]}/h2`, {[barMan2[i][0]]: barMan2[i][1].split("_")[1]});
    FBKS.updateDBRow(`barmen/${sm[i][1].split("_")[0]}/shiftmanager`, {[sm[i][0]]: sm[i][1].split("_")[1]});
  }

  res.status(200).send("1");
}

function error404(req, res) {
    res.status(404).render('../errors/404.ejs');
}

app.listen(app.PORT || 3000);
