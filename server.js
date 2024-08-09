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
    dateStrings:true
    
}
var mysql=mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null)
        console.log("Connected To Database Successfulllyyyy");
    else
    console.log(err.message);
})
app.listen(2001,function()
{
    console.log("Server Started   :-)");
})

app.get("/",function(req,resp)
{
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
   
})
app.get("/signup",function(req,resp){
   // console.log(req.query)
    mysql.query("insert into users values(?,?,?,?)",[req.query.txtemail,req.query.txtpwd,req.query.utypee,1],function(err){
        
        if(err==null)
            resp.send("You have Signed Up Successfully");
        else if(req.query.txtemail!="")
            resp.send("Email Id had been already Registred");
        else
            resp.send(err.message)
    })
})
app.get("/login",function(req,resp){
    mysql.query("select * from users where email=? and pwd=?",[req.query.txtemaill,req.query.txtpwdd],function(err,result){
        
        if(err!=null)
            resp.send(err.message);
       if(result.length==0){
         
            resp.send("Invalid Email Id or Password");
            return;
        }
        if(result[0].status==1)
            {
                resp.send(result[0].utype); return;
            }
         else{
                resp.send("U R Blocked!!!"); return;
            }
    })
})
app.get("/infldash",function(req,resp)
{
    let path=__dirname+"/public/infldash.html";
    resp.sendFile(path);
   
})
app.get("/inflprofile",function(req,resp)
{ 
    let path=__dirname+"/public/inflprofile.html";
    resp.sendFile(path);
   
})
app.post("/profilesave",function(req,resp){
    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.prpic.name;
             let path=__dirname+"/public/uploads/"+fileName;
             req.files.prpic.mv(path);
        }
        else
        fileName="nopic.jpg";
    ary=req.body.contype;
        let str = "";
        
        if (Array.isArray(ary)) {
          for (i = 0; i < ary.length; i++) {
            str += ary[i] + ",";
           
          }
           str = str.slice(0, -1); // for extra comma
        }
        else{
          str=ary
        }
            

mysql.query("insert into profiles values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtemail,req.body.txtpname,fileName,req.body.txtmno,req.body.gender,req.body.dob,req.body.txtadr,req.body.txtcity,req.body.state,req.body.txtpcode,str,req.body.txtinsta,req.body.txtutube,req.body.txtx,req.body.txtothers],function(err,result){
    if(err==null)
        resp.send("successfull");
    else
        resp.send(err.message);

})
})
app.post("/profileupdate",function(req,resp){
    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.prpic.name;
             let path=__dirname+"/public/uploads/"+fileName;
             req.files.prpic.mv(path);
        }
        else
        fileName=req.body.hdn;
    ary=req.body.contype;
        let str = "";
        
        if (Array.isArray(ary)) {
          for (i = 0; i < ary.length; i++) {
            str += ary[i] + ",";
           
          }
           str = str.slice(0, -1); // for extra comma
        }
        else{
          str=ary
        }
            

mysql.query("update profiles set pname=?,prpicpath=?,mno=?,gender=?,dob=?,adress=?,city=?,state=?,pcode=?,contype=?,insta=?,utube=?,x=?,other=? where email=?",[req.body.txtpname,fileName,req.body.txtmno,req.body.gender,req.body.dob,req.body.txtadr,req.body.txtcity,req.body.state,req.body.txtpcode,str,req.body.txtinsta,req.body.txtutube,req.body.txtx,req.body.txtothers,req.body.txtemail],function(err,result){
    if(err==null)
        resp.send("successfull");
    else
        resp.send(err.message);

})
})
app.get("/finduserdetails",function(req,resp)
{
    let email= req.query.txtemail;
   
    mysql.query("select * from profiles where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })
   
})
app.get("/postbooking",function(req,resp){
    console.log(req.query)
    mysql.query("insert into events values(null,?,?,?,?,?,?)",[req.query.txtemail,req.query.txttitle,req.query.doe,req.query.starttime,req.query.txtplace,req.query.txtloc],function(err){
        
        if(err==null)
            resp.send("Event Booking Posted");
        else
            resp.send(err.message);
    })
})
app.get("/updatepass",function(req,resp){

    mysql.query("select * from users where email=? and pwd=?",[req.query.txtemails,req.query.txtpwdold],function(err,result){
        
        if(err!=null)
            resp.send(err.message);
       if(result.length==0){
         
            resp.send("Invalid Id or Old Password ");
            return;
        }
        else{
            if(req.query.txtpwdnew==req.query.txtpwdcon){
                mysql.query("update users set pwd=? where email=?",[req.query.txtpwdnew,req.query.txtemails],function(err,result){
                    if(err==null)
                        resp.send("updated password");
                    else
                        resp.send(err.message);
                
                })
            }
            else{
                resp.send("New password and Confirmed password are not same")
            }
        }
    })
})
app.get("/admindash",function(req,resp)
{
    let path=__dirname+"/public/admindash.html";
    resp.sendFile(path);
   
})
app.get("/usermanager",function(req,resp)
{
    let path=__dirname+"/public/adminuser.html";
    resp.sendFile(path);
   
})
app.get("/inflconsole",function(req,resp)
{
    let path=__dirname+"/public/admininflconsole.html";
    resp.sendFile(path);
   
})
app.get("/fetchall",function(req,resp){
    mysql.query("select * from users ",function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/deleteone",function(req,resp){
    mysql.query("delete  from users where email=? ",[req.query.email],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Deleted");
    })
    mysql.query("delete  from profiles where email=? ",[req.query.email],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Deleted");
    })


})
app.get("/block",function(req,resp){
    req.query.status=0;
    mysql.query("update users set status=? where email=? ",[req.query.status,req.query.email],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Blocked");
    })

})
app.get("/unblock",function(req,resp){
    req.query.status=1;
    mysql.query("update users set status=? where email=? ",[req.query.status,req.query.email],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Unblocked");
    })

})
app.get("/fetchallinfl",function(req,resp){
    mysql.query("select * from profiles ",function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/inflfinder",function(req,resp)
{
    let path=__dirname+"/public/inflfinder.html";
    resp.sendFile(path);
   
})
app.get("/findcities",function(req,resp){
    mysql.query("select distinct city from profiles",function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflall",function(req,resp)
{

   

    mysql.query("select * from profiles where contype like ? && city = ? && pname like ? ",["%"+req.query.contype+"%",req.query.city,"%"+req.query.pname+"%"],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflcontypecity",function(req,resp)
{

   

    mysql.query("select * from profiles where contype like ? && city = ?  ",["%"+req.query.contype+"%",req.query.city],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflcontypepname",function(req,resp)
{

   

    mysql.query("select * from profiles where contype like ? && pname like  ?  ",["%"+req.query.contype+"%","%"+req.query.pname+"%"],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflpnamecity",function(req,resp)
{

   

    mysql.query("select * from profiles where city = ? && pname like ? ",[req.query.city,"%"+req.query.pname+"%"],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflcontype",function(req,resp)
{

   

    mysql.query("select * from profiles where contype like ?  ",["%"+req.query.contype+"%"],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflcity",function(req,resp)
{

   

    mysql.query("select * from profiles where city=  ?  ",[req.query.city],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/findinflpname",function(req,resp)
{

   

    mysql.query("select * from profiles where pname like ?  ",["%"+req.query.pname+"%"],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/eventmanager",function(req,resp)
{
    let path=__dirname+"/public/eventmanager.html";
    resp.sendFile(path);
   
})
app.get("/showallevents",function(req,resp){
    mysql.query("select * from events where email=? ",[req.query.email],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultjsonarray);
    })

})
app.get("/deleteevent",function(req,resp){
    mysql.query("delete  from events where rid=? ",[req.query.rid],function(err,resultjsonarray){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Deleted");
    })
    


})
app.get("/branddash",function(req,resp)
{
    let path=__dirname+"/public/branddash.html";
    resp.sendFile(path);
   
})
app.get("/brandprofile",function(req,resp)
{ 
    let path=__dirname+"/public/brandprofile.html";
    resp.sendFile(path);
   
})
app.get("/bprofilesave",function(req,resp){
   
       

mysql.query("insert into bprofiles values(?,?,?,?,?,?,?,?)",[req.query.txtbemail,req.query.txtbname,req.query.txtbmno,req.query.txtbind,req.query.txtbadr,req.query.txtbcity,req.query.bstate,req.query.txtbpcode],function(err,result){
    if(err==null)
        resp.send("successfull");
    else
        resp.send(err.message);

})
})
app.get("/bprofileupdate",function(req,resp){
    

mysql.query("update bprofiles set bname=?,bmno=?,bind=?,badr=?,bcity=?,bstate=?,bpcode=? where email=?  ",[req.query.txtbname,req.query.txtbmno,req.query.txtbind,req.query.txtbadr,req.query.txtbcity,req.query.bstate,req.query.txtbpcode ,req.query.txtbemail],function(err,result){
    if(err==null)
        resp.send("successfull");
    else
        resp.send(err.message);

})
})
app.get("/findbuserdetails",function(req,resp)
{
    let email= req.query.txtbemail;
   
    mysql.query("select * from bprofiles where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })
   
})
app.get("/bupdatepass",function(req,resp){

    mysql.query("select * from users where email=? and pwd=?",[req.query.txtemails,req.query.txtpwdold],function(err,result){
        
        if(err!=null)
            resp.send(err.message);
       if(result.length==0){
         
            resp.send("Invalid Id or Old Password ");
            return;
        }
        else{
            if(req.query.txtpwdnew==req.query.txtpwdcon){
                mysql.query("update users set pwd=? where email=?",[req.query.txtpwdnew,req.query.txtemails],function(err,result){
                    if(err==null)
                        resp.send("updated password");
                    else
                        resp.send(err.message);
                
                })
            }
            else{
                resp.send("New password and Confirmed password are not same")
            }
        }
    })
})