var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
router.get("/",isLoggedIn, function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/Index",{campgrounds: allcampground,currntUser:req.user});
        }
    });
});

router.post("/", function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampgrounds= {name: name,image: image,description:desc,author:author }
    Campground.create(newCampgrounds, function(err,newlyCreated){
        if(err){
            console.log("something went wrong");
            console.log(err);
        }else{
             res.redirect("/campgrounds");
    
        }
    });
});
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//show more info about one campground

router.get("/:id",isLoggedIn,function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }
        else
        //render show template with that campground
       {
           console.log(foundCampground,"Hii");
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
   
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;