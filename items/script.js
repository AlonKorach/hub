"use strict"
  let timer = window.setInterval(function () {
   var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let itms = (this.responseText);
        if (itms == "") {
          document.getElementById("cats").innerHTML = '<span class="error" style="text-align: center;display: block;margin: 0 auto;">אין קטגוריות</span>';
          clear()
          return;
        }
        itms = JSON.parse(itms)
        printItems(itms);
        clear();
      }
    }
    xhttp.open("GET", "/getItems", true);
    xhttp.send();
  }, 1000);

  function printItems(itms){
    let cats = [];
    let items = [];
    let names = [];
    Object.keys(itms).forEach(function (cat) {
      cats.push(cat)
    })

    for (let i = 0; i < cats.length; i++) {
      let it = Object.keys(itms[cats[i]]).map(function (e) {
        return itms[cats[i]][e];
      })
      items[cats[i]] = it;
      names[cats[i]] = Object.keys(itms[cats[i]])[Object.keys(itms[cats[i]]).length - 1]
      writeItems(cats[i], items[cats[i]], names[cats[i]]);
    }
  }

  function writeItems(cat, itms, catName) {
    document.getElementById("cats").innerHTML +=`<div class='cat' id="${cat}"><div class='name' onclick='edit("${cat}", 0)'>${cat}<img src='./pencil.png' class='edit'></div></div>`;
    let html = "";
    let length = Object.keys(itms).map(function (e) {
      return itms[e]
    }).length;

    for (let i = 0; i < length; i++) {
      if (typeof(itms[i]) == "number"){
        let limited = 'לא מוגבל';
        if (itms[i] > 0) limited = `מוגבל ל ${itms[i]} כל משמרת.`;
        document.getElementById(cat).innerHTML += `<span id='limited'>${limited}</span>`;

        continue;
      }
      let itemName = Object.keys(itms[i]).map(function(e) {
        if (e == 'item'){
          return itms[i]['item'];
        }
      });

      itemName = itemName.filter(function (e) {
        return e != undefined;
      })


      let img = Object.keys(itms[i]).map(function (e) {
        if (e == 'img'){
          return itms[i]['img'];
        }
      });

      img = img.filter(function (e) {
          return e != undefined;
        })
      html += `<div class='item' onclick='location.href="./editItem?item=${itemName}&catName=${cat}"'><img src='${img}'><span>${itemName}</span></div>`
    }
    document.getElementById(cat).innerHTML += `<div>${html}</div><a href='/add?cat=${cat}' id='addLink'><span class="miniPlusIcon">+</span>הוספת פריט</a>`
  }

  function clear() {
    window.clearInterval(timer);
  }

function edit(name, type) {
  switch (type) {
    case 0:
      // Edit cat.
      document.getElementById("editCat").style.display = 'block';
      document.getElementById("catName").value = document.getElementById(name).getElementsByClassName("name").item(0).innerText;
      document.getElementById("oldCat").value = document.getElementById(name).getElementsByClassName("name").item(0).innerText;
      break;
    case 1:

      break;
  }
}
