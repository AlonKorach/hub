const express = require('express');
const app = express();
var fs = require('fs');
const bodyPraser = require('body-parser');
app.use(bodyPraser.json());
let ejs = require('ejs')
app.use(bodyPraser.urlencoded({ extended: true }));

var serviceAccount = require(__dirname+ "/fire.json");
var admin = require("firebase-admin");
const port = 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-40ac5.firebaseio.com"
});
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var db = admin.database();
var ref = db.ref('/');

var normal = ref.child("normal")
var special = ref.child("special")
var check3 = true;
//fire base
//edit normal days
async function getnormal(day)
{
    var a = await normal.child(day).once('value',function(snapshot)
    {
        return snapshot
    });
    return JSON.parse(JSON.stringify(a))
}
function removedate(date)
{
    special.child(date).remove()
}
function actremovenormal(date,activity)
{
    normal.child(date).child(activity).remove()
}
async function actremovedate(date,activity)
{
    var a = await getbdate(date)
    if(a == null)
    {
        var b = date.split("-")
        var c = new Date(parseInt(b[2]),parseInt(b[1]),parseInt(b[0]),1,1,1,1)
        var nor = getnormal(day(c.getDay()))
        setdate(date,nor)
    }
    actremovebdate(date,activity)
}
async function editdate(date,activity,value)
{
    var a = await getbdate(date)
    if(a == null)
    {
        var b = date.split("-")
        var c = new Date(parseInt(b[2]),parseInt(b[1]),parseInt(b[0]),1,1,1,1)
        var nor = getnormal(day(c.getDay()))
        setdate(date,nor)
    }
    editbdate(date,activity,value)
}

async function getdate(date)
{
    var a = await getbdate(date)
    if(a != null)
    { return a;}else
    {
        var b = date.split("-")
        var c = new Date(parseInt(b[2]),parseInt(b[1]),parseInt(b[0]),1,1,1,1)
        var nor = getnormal(c.getDay())
        setdate(date,nor)
        return nor;
    }
}
//edit normal days
function editnormal(day,activity,value)
{
    normal.child(day).child(activity).set(value)
}



//DON'T USE THESE, THEY ARE MADE FOR THE USE OF OTHER COMMANDS
async function getbdate(date)
{
    var a = await special.child(date).once('value',function(snapshot)
    {
        return snapshot
    });
    return JSON.parse(JSON.stringify(a))
}
function day(da)
{
    if(da>6||da<0)return null;
    switch(da)
    {
        case 0: return "Sunday"
        case 1: return "Monday"
        case 2: return "Tuesday"
        case 3: return "Wednesday"
        case 4: return "Thursday"
        case 5: return "Friday"
        case 6: return "Saturday"
    }
}
function editbdate(date,activity,value)
{
    special.child(date).child(activity).set(value)
}
function setdate(date,value)
{
    special.child(date).set(value)
}
function actremovebdate(date,activity)
{
    special.child(date).child(activity).remove()
}




app.get('/add', (req, res) => add(req, res))

async function add(req, res) {
var today=new Date();
var day=""+today.getDate();
var month=today.getMonth()+1;
var year=""+today.getFullYear();
data=await getdate(""+day+"-"+month+"-"+year);
if(data==null){
    data="";
    var keys="";
}
else{
    var keys=JSON.stringify(Object.keys(data));
    data=JSON.stringify(data);
}
console.log(data);
console.log(day);
    res.render(__dirname + '/add2.ejs',{data:data,keys:keys,day:day,month:month,year:year});
}

app.post('/add', async function add(req, res) {
 //   var type = req.body.type;
   // selecttype(typfget e, req, res);

    var tstart = req.body.tstart;
    var tend = req.body.tend;
    var name = req.body.name;
    var place = req.body.place;
    var day = req.body.day;
    var month = req.body.month;
    var year = req.body.year;
    var co=req.body.co;
    var clr=req.body.clr;
    var isnormal=req.body.isnormal;
    var normal=req.body.normal;
    var date = "";
    var date = date + day + "-" + month + "-" + year;
    var goto=req.body.goto;
    console.log(name);
    if(goto!=null&&name==null){
        var date=""+day+"-"+month+"-"+year
        var data=await getdate(date);
        if(data==null){
            data="";
            var keys="";
        }
        else{
            var keys=JSON.stringify(Object.keys(data));
            data=JSON.stringify(data);
        }
        console.log(data);
        console.log(keys);
        res.render(__dirname + '/add2.ejs',{data:data,keys:keys,day:day,month:month,year:year});
    }

    if (name!=null) {
        console.log("defined");
        console.log(date)

        var json = { tstart: tstart, tend: tend, name: name,co:co,clr:clr , place: place }
        var stringed = JSON.stringify(json);
        console.log(stringed);
        console.log(isnormal);
        if(!(isnormal)){
        editdate(date, name, stringed);}
        else{
            editnormal(normal,name,stringed);
        }
        console.log("lols");
    }

});

function selecttype(type,req, res) {
    if (type == 0) {
        res.sendFile(__dirname + '/add.html');
    }

    if (type == 1) {
        res.sendFile(__dirname + '/change.html');
    }

    if (type == 2) {
        res.sendFile(__dirname + '/remove.html');
    }





}





function validDate(day, month, year) {
    var valid = true;
    var daysmonth = 30;

    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        daysmonth = 31;
    }
    if (month == 2) {
        if (year % 4 == 0) {
            if (year % 100 == 0) { daysmonth = 28; }
            else {
                daysmonth = 29;
            }
        }
        else {
            daysmonth = 28;
        }

        if (!(day > 0 || day <= daysmonth)) { valid = false; }
        if (!(year > 2018) && (year < 2100)) {
            valid = false;
        }
        if ((month < 0) || (month > 12)) {
            valid = false;
        }
        return valid;
    }
}


app.get('/test', (req,res) => sendtest(req,res))

async function sendtest(req,res){
    var dataToday=getTodayData();
    console.log(dataToday);
    var data= await getdate(dataToday);
    console.log(data);
    console.log(Object.keys(data))
    keys=Object.keys(data);


    /*array.forEach(element => {
        console.log(element)
    });
    console.log(typeof data);*/
    var keysless= JSON.stringify(keys).replace("#&","");
    for(var i = 0;i<keys.length; i++)
    {
        console.log(keys[i])
    }
    console.log(keysless);
    keys=JSON.stringify(keys);
    data=JSON.stringify(data);
    if (keys==null){
        keys="";
    }
    if (data==null){
     data="";
 }
     res.render(__dirname + '/TableThing().ejs', {data:data,keys:keys});

}

app.get('/*', (req, res) => showtable(req, res))



async function showtable(req, res) {
   var dataToday=getTodayData();
   console.log(dataToday);
  // var data= await getdate(dataToday);
  // console.log(data);
   //console.log(Object.keys(data))
   //keys=Object.keys(data);
   console.log(getWeakData());
   var week=getWeakData();
 /* var data1= await getdate(week[0]);
  if (data1==null){
    data1="";
   }
  var keys1=Object.keys(data1);
  var data2= await getdate(week[1]);
  if (data2==null){
    data2="";
   }
  var keys2=Object.keys(data2);

  var data3= await getdate(week[2]);
  if (data3==null){
    data3="";
   }
  var keys3=Object.keys(data3);
  var data4= await getdate(week[3]);
  if (data4==null){
    data4="";
   }
  var keys4=Object.keys(data4);
  var data5= await getdate(week[4]);
  if (data4==null){
    data4="";
   }
  var keys5=Object.keys(data5);
  var data= await getdate(week[5]);
  if (data==null){
    data="";
   }
   else{
  var keys=Object.keys(data);
   }
  */

   /*array.forEach(element => {
       console.log(element)
   });
   console.log(typeof data);*/
   //var keysless= JSON.stringify(keys).replace("#&","");
  // for(var i = 0;i<keys.length; i++)
   //{
     //  console.log(keys[i])
   //}

   //console.log(keysless);
  /*if(data!=null){
   keys=JSON.stringify(keys);
   data=JSON.stringify(data);
  }
  if(data1!=null){
    keys1=JSON.stringify(keys);
    data1=JSON.stringify(data);
   }
   if(data2!=null){
    keys2=JSON.stringify(keys);
    data2=JSON.stringify(data);
   }
   if(data3!=null){
    keys3=JSON.stringify(keys);
    data3=JSON.stringify(data);
   }
   if(data4!=null){
    keys4=JSON.stringify(keys);
    data4=JSON.stringify(data);
   }
   if(data5!=null){
    keys5=JSON.stringify(keys);
    data5=JSON.stringify(data);
   }
   if (keys==null){
       keys="";
   }
   if (data==null){
    data="";
   }

if (keys1==null){
    keys1="";
}
if (data1==null){
 data1="";

}
if (keys2==null){
    keys2="";
}
if (data2==null){
 data2="";

}
if (keys3==null){
    keys3="";
}
if (data3==null){
 data3="";

}
if (keys4==null){
    keys="";
}
if (data4==null){
 data4="";

}
if (keys5==null){
    keys5="";
}
if (data5==null){
 data5="";

} */



data1=await getdate(week[0]);
if(data1==null){
    data1="";
    var keys1="";
}
else{
    var keys1=JSON.stringify(Object.keys(data1));
    data1=JSON.stringify(data1);
}


data2=await getdate(week[1]);
if(data2==null){
    data2="";
    var keys2="";
}
else{
    var keys2=JSON.stringify(Object.keys(data2));
    data2=JSON.stringify(data2);
}

data3=await getdate(week[2]);
if(data3==null){
    data3="";
    var keys3="";
}
else{
    var keys3=JSON.stringify(Object.keys(data3));
    data3=JSON.stringify(data3);
}

data4=await getdate(week[3]);
if(data4==null){
    data4="";
    var keys4="";
}
else{
    var keys4=JSON.stringify(Object.keys(data4));
    data4=JSON.stringify(data4);
}

data5=await getdate(week[4]);
if(data5==null){
    data5="";
    var keys5="";
}
else{
    var keys5=JSON.stringify(Object.keys(data5));
    data5=JSON.stringify(data5);
}
data=await getdate(week[5]);
if(data==null){
    data="";
    var keys="";
}
else{
    var keys=JSON.stringify(Object.keys(data));
    data=JSON.stringify(data);
}
res.render(__dirname + '/TableThing.ejs' , {data:data,keys:keys,data1:data1,keys1:keys1,data2:data2,keys2:keys2,keys3:keys3,data3:data3,keys4:keys4,data4:data4/*data1:data1,data2:data2,data3:data3,data4:data4,data5:data5,data:data*/});
}

function getTodayData(){
var today=new Date();
date=today.getMonth()+1;
var folder= ""+today.getDate()+"-"+date+"-"+today.getFullYear();
return folder;
}
function getWeakData(){
var today= new Date();
var yesterday= new Date(today.getTime()- (24 * 60 * 60 * 1000)) ;
var tommorow=new Date(today.getTime()+ (24 * 60 * 60 * 1000));
var tommorow2=new Date(tommorow.getTime()+ (24 * 60 * 60 * 1000));
var tommorow3=new Date(tommorow2.getTime()+ (24 * 60 * 60 * 1000));
var tommorow4=new Date(tommorow3.getTime()+ (24 * 60 * 60 * 1000));
var week=[toformat(yesterday),toformat(today),toformat(tommorow),toformat(tommorow2),toformat(tommorow3),toformat(tommorow4)];
return week;
}

function toformat(date){

return ""+date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear();
}

function yesterday(day, month,year){
if (day==1){
 month-=1;
 if (month==0){
     year--;
     month=12;
 }
 if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
day=31;
}
if (month == 2) {
    if (year % 4 == 0) {
        if (year % 100 == 0) {
             day = 28;
            }
        else {
            day = 29;
        }
    }
    else {
        day = 28;
    }


}

else{
day=30;
}

}
return day+"-"+month+"-"+year;
}


function tommorow(date){
  var  tomorrow = new Date(date.getTime() + (24 * 60 * 60 * 1000));
return tommorow;
}

/*function tommorow(day, month, year){
    var add=false;
    if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)&&day==31) {
        day=1;
        var add =true;
        }

        if (month == 2) {
            if (year % 4 == 0) {
                if ((year % 100 == 0)&&day==28) {
                     day = 1;
                     add=true
                    }
                else if(day==29) {
                    day=1;
                    add=true
                }
            }
            else if(day==28){
                day=1;
add=true;
            }


}
else{
    day++;
}
if(add){
    month++;
}
if (month==13){
month=1;
year++;

}
return day+"-"+month+"-"+year;
}*/

app.post('/deleteness', (req,res) => del(req,res))

function del(req,res)
{
	removedate(req.body.day);
}




    app.listen(3000);
