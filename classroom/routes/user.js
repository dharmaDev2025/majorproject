const express=require("express");
const router=express.Router();
//Index-users
router.get("/",(req,res)=>{
    res.send("GET for users");

});
//show-users
router.get("/:id",(req,res)=>{
    res.send("get for a user id");


});
//post-users
router.post("/",(req,res)=>{
    res.send("POST FOR USERS");

});
//delete user
router.delete("/:id",(req,res)=>{
    res.send("delete for the user");

});
module.exports=router;