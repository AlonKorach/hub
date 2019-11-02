"use strict"
function formValidation() {
    document.getElementById('error1').style.display = 'none';
    document.getElementById('error2').style.display = 'none';
    document.getElementById('error3').style.display = 'none';
    document.getElementById('error4').style.display = 'none';
    document.getElementById('error5').style.display = 'none';
    document.getElementById('error6').style.display = 'none';

    let form            = document.getElementsByTagName("form").item(0);
    let name            = form.elements.item(0).value;

    let cat             = form.elements.item(1).value;
    if (cat == "") cats = form.elements.item(3).value

    let limited          = form.elements.item(2).value;
    if (limited == "") limited  = form.elements.items(4).value

    let img             = form.elements.item(3).value;
    if (img == "") img  =  form.elements.item(5).value;

    if (!nameValidation(name)) {
      if (!nameValidation(name, 1)) document.getElementById('error1').style.display = 'block';
      if (!nameValidation(name, 0)) document.getElementById('error1').style.display = 'block';
      if (!nameValidation(name, 2)) document.getElementById('error2').style.display = 'block';
      return false;
    } if (!numberValidation(limited)) {
      if (!numberValidation(limited, 0)) document.getElementById('error4').style.display = 'block';
      if (!numberValidation(limited, 1)) document.getElementById('error5').style.display = 'block';
      return false;
    }  if (!imgValidition(img)) {
      if (!imgValidition(img, 0)) document.getElementById('error6').style.display = 'block';
      if (!imgValidition(img, 1)) document.getElementById('error6').style.display = 'block';
      return false;
    }
    return true;
}

function imgValidition(img, number = null) {
  var fileExtension = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
  switch (number) {
    case 0:
    if (img == "") return false;
    break;
    case 1:
      if(!/\.jpe?g$/i.test(img) && !/\.png?$/i.test(img)) return false;
      break;
    default:
      if(!/\.jpe?g$/i.test(img) && !/\.png?$/i.test(img) || img == "") return false;
  }
  return true;
}

function numberValidation(number, numb = null) {
  switch (numb) {
    case 0:
      if (number.length < 0) return false;
    case 1:
      var exp = /^[0-9]+$/;
      if (!number.match(exp)) return false;
      break;
    default:
      var exp = /^[0-9]+$/;
      if (number.lenth < 0 || !number.match(exp)) return false;
  }
  return true;
}

function nameValidation(name, numb = null) {
    switch (numb) {
        case 0:
            if (name.length < 2) {
                return false;
            }
        break;
        case 1:
            if(name == "") {
                return false;
            }
            break;
        break;
        case 2:
            var alphaExp = /^[a-zא1-ת]+/i
            if (!name.match(alphaExp)) {
                return false;
            }
            break;
        default:
        var alphaExp = /^[a-zא-ת]+/i
        if (name.length < 2) {
            return false;
        } else if (!name.match(alphaExp)) {
          return false;
        }

            break;
    }
    return true;
}
