const express = require('express');
app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const admin = require('firebase-admin');
const FB = require('./FBKS');
const path = require('path');
const ejsLint = require('ejs-lint');
let Busboy = require('connect-busboy');
const fs = require('fs')
let multer  = require('multer')
let inspect = require('util').inspect
const url = require('url');
let FBKS = new FB(admin, require('./hubks-b0507-firebase-adminsdk-t8hxc-741d85cc26'), 'hubks-b0507');

// DB Strc - items/{cat}/{id}/

app.set('view engine', 'ejs');

app.engine('ejs', ejs.renderFile);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.set('uploads', path.join(__dirname + "/uploads"))
app.set('style', __dirname)
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));
app.use(Busboy());

// parse application/json
app.use(bodyParser.json())

app.get('/', indexPage);
app.get("/getItems", getItems);
app.get("/editItem", editItem);

app.get('/add', add)
app.post("/doAdd", doAdd);

app.get("/getCats", getCats);

app.post('/doAddCat', doAddCat);
app.post('/doEditCat', doEditCat);
app.post('/doEdit', doEdit)
app.get("/del", doDel)


let items = "";
let timer = "";
function indexPage(req, res) {
  getItms();
  let error = {error: "", oldCat:"", msg:""}
  if (req.query.msg == "null") {
    if (req.query.oldCat != null) {
      error = {error:req.query.do, oldCat: req.query.oldCat, msg:rqe.query.msg}
    } else {
      error = {error:req.query.error, oldCat: "", msg:req.query.msg}
    }
  } else if (req.query.msg == "nocats") {
    error = {error:req.query.error, oldCat: "", msg:req.query.msg}
  }
  res.status(200).render("../index.ejs", error);
}

function doDel(req, res) {
  delItem(req.query['item']);
  res.send("1")
}

function clear() {
  clearInterval(timer);
}

function getItems(req, res) {
  if (items != "") {
    res.status(200).send(items);
  } else {
    res.status(500).send("Waiting...");
  }
}

function getItms() {
  FBKS.readDBItems("/items").then((snapshot) => {
    items = snapshot.val();
  })
}

function delItem(item) {
  FBKS.deleteDBItem(item);
}

function doAdd(req, res) {
  let saveTo;
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (!imgValidition(filename)) {
      if (!imgValidition(filename, 0)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err6");
      if (!imgValidition(filename, 1)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err7");
    }
    saveTo = path.join(__dirname, "/uploads/" + filename)
    file.pipe(fs.createWriteStream(saveTo));
    let domain = req.headers.host;
    let protocol = req.protocol;
    saveTo = `${protocol}://${domain}/uploads/${filename}`;
  });

  let item = {};
  req.busboy.on('finish', function() {
    // validtion
    item['img'] = saveTo;
    let validtion = formValidation(item)
    if (validtion != "true") return res.redirect(`/add?cat=${item['cat']}&error=${validtion}&item=${item['item']}`)
    FBKS.addDBRow(`items/${item['cat']}`, item['item'].trim(), {item: item['item'].trim(), img: saveTo, sd: item['sd'].trim(), limited: parseInt(item['limited'].toString().replace(/.{4}(?:0*([1-9]\d{1,9}|\w{10}))$/g, ""))});
    res.redirect("/");
  });
  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    item[fieldname] = val;
  });


req.pipe(req.busboy);
}

function fetchItem(catName, itemName) {
  return new Promise(resolve => setTimeout(function (){
    FBKS.readDBItems(`/items/${catName}/${itemName}`).then((snapshot) => {
      resolve(snapshot.val());
    })
  }), 3000)
}

async function editItem(req, res) {
  let item = await fetchItem(req.query.catName, req.query.item);
  let cats = await fetchCats();
  res.render('../addItem.ejs', {cats: cats, item: item, catName: req.query.catName, error: req.query.error})
}

function getCats(req, res) {
  FBKS.readDBItems("/items").then((snapshot) => {
    res.status(200).send(JSON.stringify(Object.keys(snapshot.val())));
  })
}

function fetchCats() {
  return new Promise(resolve => setTimeout(function (){
    FBKS.readDBItems("/items").then((snapshot) => {
      resolve(snapshot.val());
    })
  }), 3000)
}

async function add(req, res) {
  let cats = await fetchCats();
  // cats = ["1", "2", "3"]
  if (cats == undefined) res.redirect("./?error=add&msg=nocats")
  res.status(200).render("../addItem.ejs", {cats: cats, catName: req.query.cat, item: "", error: req.query.error});
}

function formValidation(form) {
    let error           = "";
    let item            = form['item'];
    let cat             = form['cat'];
    let limited         = form['limited']
    let img             = form['img']

    if (!nameValidation(item)) {
      if (!nameValidation(item, 1)) error = "err1"
      if (!nameValidation(item, 0)) error = 'err1'
      if (!nameValidation(item, 2)) error = 'err2'
      return error
    } if (!nameValidation(cat)) {
      if (!nameValidation(cat, 1)) error = 'err3'
      return error
    } if (!numberValidation(limited)) {
      if (!numberValidation(limited, 0)) error = 'err4'
      if (!numberValidation(limited, 1)) error = 'err5'
      return error
    }  if (!imgValidition(img)) {
      if (!imgValidition(img, 0)) error = 'err6'
      if (!imgValidition(img, 1)) error = 'err7'
      return error
    }
    return "true";
}

function imgValidition(img, number = null) {
  let error = false;
  switch (number) {
    case 0:
    if (img == "") return error
    break;
    case 1:
      if(!/\.jpe?g$/i.test(img) && !/\.png?$/i.test(img)) return error
      break;
    default:
      if((!/\.jpe?g$/i.test(img) && !/\.png?$/i.test(img)) || img == "") return error
  }
  return true;
}

function numberValidation(number, numb = null) {
  let error = false;
  switch (numb) {
    case 0:
      if (number.length < 0) return error
      if (number.length > 5) return error
    case 1:
      var exp = /^[0-9]+$/;
      if (!number.toString().match(exp)) return error
      if (number.toString().includes(".")) return error
      break;
    default:
      var exp = /^[0-9]+$/;
      if (number.lenth < 0 || !number.toString().match(exp) || number.toString().match(".") || number.length > 5) return error
  }
  return true;
}

function nameValidation(item, numb = null) {
  let error = false;
    switch (numb) {
        case 0:
            if (item.length < 2) {
                return error
            }
        break;
        case 1:
            if(item == "") {
                return error
            }
            break;
        break;
        case 2:
            var alphaExp = /^[a-zא-ת\s]+$/i
            if (!item.match(alphaExp)) {
                return error
            }
            break;
        default:
        var alphaExp = /^[a-zא-ת\s]+$/i
        if (item.length < 2) {
            return error
        } else if (!item.match(alphaExp)) {
          return error
        }
            break;
    }
    return true;
}

function update(req, res){

}

function doEditCat(req, res) {
  if (req.body.submit == "מחיקה") {
    FBKS.deleteDBItem(req.body.oldCat)
    res.redirect('/')
  }
  if (req.body.catName == null) return res.redirect("/?error=edit&msg=null&oldCat=" + req.body.oldCat);
  FBKS.updateDBRow(`/items/`, {[req.body.catName.trim()]: items[req.body.oldCat]})
  FBKS.deleteDBItem(req.body.oldCat);
  res.redirect('/')
}

function doAddCat(req, res) {
  if (req.body.catName == null) return res.redirect("/?error=add&msg=null");
  FBKS.updateDBRow("/items/", {[req.body.catName.trim()]: ""})
  res.redirect('/')
}


function doEdit(req, res) {
  let saveTo;
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (filename == "") {
        return file.resume();
    }
    if (!imgValidition(filename)) {
      if (!imgValidition(filename, 0)) return res.redirect("./editItem?item="+item['item']+"&catName="+item['cat']+"&error=err6");
      if (!imgValidition(filename, 1)) return res.redirect("./editItem?item="+item['item']+"&catName="+item['cat']+"&error=err7");
    }
    saveTo = path.join(__dirname, "/uploads/" + filename)
    file.pipe(fs.createWriteStream(saveTo));
    let domain = req.headers.host;
    let protocol = req.protocol;
    saveTo = `${protocol}://${domain}/uploads/${filename}`;
  });

  let item = {};
  req.busboy.on('finish', function() {
    // validtion
    if (!nameValidation(item['item'])) {
      if (!nameValidation(item['item'], 1)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err1")
      if (!nameValidation(item['item'], 0)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err1")
      if (!nameValidation(item['item'], 2)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err2")
    }
    if (!numberValidation(parseInt(item['limited']))) {
      if (!numberValidation(parseInt(item['limited']), 0)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err4")
      if (!numberValidation(parseInt(item['limited']), 1)) return res.redirect("/editItem?item="+item['item']+"&catName="+item['cat']+"&error=err5")
    }
    if (!saveTo) saveTo = item['img'];
    FBKS.addDBRow(`items/${item['cat']}`, item['item'].trim(), {item: item['item'].trim(), img: saveTo, sd: item['sd'].trim(), limited: parseInt(item['limited'].toString().replace(/.{4}(?:0*([1-9]\d{1,9}|\w{10}))$/g, "").trim())});
    if (item['item'] != item['oldName'] || item['cat'] != item['oldCat'] ) FBKS.deleteDBItem(`/${item['oldCat']}/${item['oldName']}`);
    res.redirect("/");
  });
  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    item[fieldname] = val;
  });


  req.pipe(req.busboy);
}
app.listen(app.PORT || 3000);
