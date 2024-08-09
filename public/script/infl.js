var express=require("express");
let app=express();
var fileuploader=require("express-fileupload");
app.use(fileuploader());
var mysql2=require("mysql2");
app.use(express.static("public"));
app.use(express.urlencoded(true))

let config={
    host:"127.0.0.1",
    user:"root",
    password:"yog581979",
    database:"project",
    
}
var mysql=mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null)
        console.log("Connected To Database Successfulllyyyy");
    else
    console.log(err.message);
})
app.listen(2002,function()
{
    console.log("Server Started   :-)");
})

app.get("/",function(req,resp)
{
    let path=__dirname+"/public/infl.html";
    resp.sendFile(path);
   
})