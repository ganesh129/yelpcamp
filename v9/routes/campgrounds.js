var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");
//show all campgrounds
router.get("/", function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/Index",{campgrounds: allcampground,currntUser:req.user});
        }
    });
});

router.post("/",middleware.isLoggedIn, function(req,res){
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
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//show more info about one campground

router.get("/:id",middleware.isLoggedIn,function(req,res){
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
//Edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    
          Campground.findById(req.params.id,function(err, foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
             
        
    });
      
});
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else
        {
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else
        res.redirect("/campgrounds");
    })
})

module.exports=router;