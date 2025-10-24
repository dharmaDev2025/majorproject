const express=require("express");
const router=express.Router();
//Index-post
router.get("/",(req,res)=>{
    res.send("GET for posts");

});
//show-posts
router.get("/:id",(req,res)=>{
    res.send("get for a post id");


});
//post-users
router.post("/",(req,res)=>{
    res.send("POST FOR USERS");

});
//delete post
router.delete("/:id",(req,res)=>{
    res.send("delete for the posts");
    
})
module.exports=router;

