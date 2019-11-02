let nodemailer = require("nodemailer")
let xl = require("exceljs")
let fs = require("fs")



function object_to_xlsx(obj,file,optional_headers=false) {
  let workbook = new xl.Workbook()
  let sheet = workbook.addWorksheet("main")
  console.log(Object.keys(obj));
  if(optional_headers!=false)
  {
    for (var i=0;i< optional_headers.length ;i++) {
      row.push( optional_headers[i])
    }
  }
  for (var d=0;d< Object.keys(obj).length;d++ ) {
    var key = Object.keys(obj)[d]
    var row = []
    console.log(key)
    for (var i=0;i< obj[key].length ;i++) {
      row.push( obj[key][i])
    }
    sheet.addRow(row)
  }
  workbook.xlsx.writeFile(file)
  return
}

async function mailfile(filep,filen,sendto,mail,password) {
  let dd ={
    service: 'gmail.com',
    auth: {
      user: mail,
      pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
  }
  console.log(dd);
  let tr= nodemailer.createTransport(dd)
  console.log("tr: \n"+tr);
  let today = new Date()
  let title = "" + today.getDate() +"/" + (today.getMonth()+1) + "/" + today.getFullYear() +""
  let message=
  {
    from: '"hub" <' + mail +'>',
    to: sendto,
    subject: title,
    text:'',
    attachments:
    [
      {
        filename: filen,
        path:filep
      }
    ]
  }
  console.log("message: "+message);
  let ad = await tr.sendMail(message, function(error, info){
  if (error) {
    console.log("error: \n"+error + "\n" + info)
  } else {
    console.log('Email sent: ' + info.response)
  }
})}



var k =
{
  headers:['name','school','class','parent\'s phone','warm','cold','weird question'],
  person_a:['guy','a school','10', '75648','true','true','sushi'],
  yes:['a','schoooool','3','not a phone number, you have been bumboozled','true','false', 'CAT']
}
//object_to_xlsx(k,'C:/Users/Gidi/Documents/GitHub/hub/info_to_xlsx/test.xlsx')
mailfile('C:/Users/Gidi/Documents/GitHub/hub/info_to_xlsx/test.xlsx','test.xlsx','gideon.max.merling@gmail.com','merkaz.noar.mail@gmail.com','hubpassword1029384756')
