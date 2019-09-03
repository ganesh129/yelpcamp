var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var passport=require("passport");
var User=require("../models/user");
router.get("/",function(req,res){
    res.render("landing");
    
});


//create comment new routes

//----------
//Auth routes
//----------
router.get("/register",function(req,res){
    res.render("register");
});
router.post("/register",function(req,res){
    req.body.username
    req.body.password 
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
            
        });
    });
});
//login routes
router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
});
//logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;