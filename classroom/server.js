const express=require("express");
const app=express();
const path=require("path");
const engine = require('ejs-mate');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// const cookieParser=require("cookie-parser");
const user=require("./routes/user.js");
app.use("/users",user);
const post=require("./routes/post.js");
app.use("/posts",post);
const session=require("express-session",);
app.use(session({secret:"dharmendra",
    resave:false,
    saveUninitialized:true
}));
const flash=require("connect-flash");
app.use(flash())
app.get("/test",(req,res)=>{
    res.send("test successfulll");

})
app.get("/count",(req,res)=>{
    if(req.session.count){
        req.session.count+=1;
    }
    else{
        req.session.count=1;

    }
    res.send(`thecount is ${req.session.count}`)
    

});
app.get("/greet",(req,res)=>{
    req.flash("sucess","ghhhih");
    let{name="haria"}=req.query;
    req.session.name=name;
    res.render("s.ejs",{name:req.session.name,msg:req.flash("sucess")});
});
app.get("/hello",(req,res)=>{
    res.send(`${req.session.name}`);
});
// app.use(cookieParser());
//signed cookie
// app.use(cookieParser("secretcode"));


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
// app.get("/",(req,res)=>{
//     res.send("inside main");
//     console.dir(req.signedCookies);
// });
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello",{signed:true});
//     res.send("send cookies successfully");

// })
