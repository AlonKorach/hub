let express = require('express')
let fs= require('fs')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
class stats_handler {
  constructor(stats_file,serialization_file)
  {
    this.stats_f=stats_file
    this.ser_f=serialization_file
    this.load_stats()
    this.load_serialization()
  }
  load_stats()
  {
    var file_text = fs.readFileSync(this.stats_f).toString()
    var str_arr = file_text.split("\n")
    if(str_arr[str_arr.length-1] =="")str_arr.pop()
    var a =[]
    for(var i =0; i<str_arr.length; i++)
    {
      a.push( parseInt(  str_arr[i]))
    }
    this.stats_ar =a
  }
  save_stats()
  {
    var a =[]
    for(var i =0;i<this.stats_ar.length;i++)
    {
      a.push("" + this.stats_ar[i])
    }
    var text = a.join('\n')
    fs.writeFileSync(this.stats_f,text)
  }
  load_serialization()
  {
    this.ser_ar= JSON.parse( fs.readFileSync(this.ser_f).toString())
  }
  save_serialization()
  {
    fs.writeFileSync(this.ser_f, JSON.stringify(this.ser_ar))
  }
  add_stat(name)
  {
    this.ser_ar.push(name)
    this.stats_ar.push(0)
  }
  increase_stat_by_num(stat,amount)
  {
    this.stats_ar[stat]+=amount
  }
  increase_stat_by_name(name,amount)
  {
    this.increase_stat_by_num( this.ser_ar.indexOf(name),amount)
  }
  set_stat_by_num(stat,value)
  {
    this.stats_ar[stat]=value
  }
  set_stat_by_name(name,value)
  {
    this.set_stat_by_num(this.ser_ar.indexOf(name),value)
  }
  reset()
  {
    for(var i = 0;i<this.stats_ar.length;i++)
    {
      this.set_stat_by_num(i,0)
    }
  }
  remove_stat_by_num(num)
  {
    this.ser_ar.splice(num,1)
    this.stats_ar.splice(num,1)
    this.save_serialization()
    this.save_stats()
  }
  remove_stat_by_name(name)
  {
    this.remove_stat_by_num(this.ser_ar.indexOf(name))
  }
  get_stat_by_num(num)
  {
    return this.stats_ar[num]
  }
  get_stat_by_name(name)
  {
    return this.get_stat_by_num(this.ser_ar.indexOf(name))
  }
  output()
  {
    console.log(this.stats_f);
    console.log(this.stats_ar);
    console.log(this.ser_f);
    console.log(this.ser_ar);
  }
}
/*
function yes(req,res)
{
  res.sendFile(__dirname+'/test.html')
}
function reta(req,res)
{
  let b = new stats_handler("C:/Users/Gidi/Documents/GitHub/hub/js_drinks/drinks.txt","C:/Users/Gidi/Documents/GitHub/hub/js_drinks/serialization.txt")
  console.log(req.body);
  var s = b.get_stat_by_num(req.body.a)
  res.send(""+s)
}
app.get('/test.html', (req,res)=> yes(req,res))
app.post('/thing.get',(req,res)=> reta(req,res))
app.listen(3000)
*/
