
//add
app.get("/add",(req,res)=> getadd(req,res))
function getadd(req,res)
{
    res.send(__dirname + 'add.html')
}
app.post("/addnf", (req,res)=> addnf)
async function addnf(req,res)
{
    var date =req.body.day
    var data = await getnormal(date)
    
    var keys = Object.keys(data)
    res.render(__dirname + '/addn.ejs', {data:JSON.stringify(data),keys:JSON.stringify(keys),date:date});
}
app.post("/addn",(req,res) => addn(req,res))
function addn(req,res)
{
    var date = req.body.date
    var name = req.body.name
    var place = req.body.place
    var stime = req.body.stime
    var etime = req.body.etime
    var coach = req.body.coach

    var json = {tstart : stime,tend : etime, name : name, co : coach, place : place}
    var string = JSON.stringify(json)
    editnormal(date,name,string)
    res.send(__dirname+"/add.html")
}
app.post("/add" ,(req,res) => add(req,res))
async function add(req,res)
{
    var day = "" + req.body.day
    var month = "" + req.body.month
    var year = "" + req.body.year
    var date = day + "-" + month + "-" + year
    var data = await getdate(date)
    var keys = Object.keys(data)
    res.render(__dirname + '/add2.ejs', {data:JSON.stringify(data),keys:JSON.stringify(keys),date:date});
}


app.post('/adds',(req,res)=> adds(req,res))
function adds(req, res)
{
    var date = req.body.date
    var name = req.body.name
    var place = req.body.place
    var stime = req.body.stime
    var etime = req.body.etime
    var coach = req.body.coach

    var json = {tstart : stime,tend : etime, name : name, co : coach, place : place}
    var string = JSON.stringify(json)
    editdate(date,name,string)
    res.send(__dirname+"/add.html")
}
//remove
app.get("/remove",(req,res)=> getremove(req,res))
function getremove(req,res)
{
    res.send(__dirname+"/remove.html")
}
app.post("/remove" ,(req,res) => remove(req,res))
async function remove(req,res)
{
    var day = "" + req.body.day
    var month = "" + req.body.month
    var year = "" + req.body.year
    var date = day + "-" + month + "-" + year
    var data = await getdate(date)
    var keys = Object.keys(data)
    res.render(__dirname + '/removedate.ejs', {data:JSON.stringify(data),keys:JSON.stringify(keys),date:date});
}
app.post("/removen", (req,res)=> removenr(req,res))
async function removenr(req,res)
{
    var date =req.body.day
    var data = await getnormal(date)
    
    var keys = Object.keys(data)
    res.render(__dirname + '/removenormal.ejs', {data:JSON.stringify(data),keys:JSON.stringify(keys),date:date})
}
app.post("/removedate",(req,res)=>premovedate(req,res))
function premovedate(req,res)
{
    var date = req.body.date
    var activity = req.body.name
    actremovedate(date,activity)
    res.send(__dirname+"/remove.html")
}
app.post("/removenorr", (req,res)=> removenorr(req,res))
function removenorr(req,res)
{
    var day = req.body.date
    var activity = req.body.name
    actremovenormal(day,activity)
    res.send(__dirname+"/remove.html")
}