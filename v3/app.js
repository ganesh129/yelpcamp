var express   = require("express"),
 app          = express(),
 bodyparser   =require("body-parser"),
 mongoose     =require("mongoose"),
 Campground   =require("./models/campground"),
 seedDB       =require("./seeds");
 seedDB();
 mongoose.connect("mongodb://localhost/Yel_camp_v3");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
    res.render("landing");
    
});
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("Index",{campgrounds: allcampground});
        }
    });
});

app.post("/campgrounds", function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newCampgrounds= {name: name,image: image,description:desc }
    Campground.create(newCampgrounds, function(err,newlyCreated){
        if(err){
            console.log("something went wrong");
            console.log(err);
        }else{
             res.redirect("/campgrounds");
    
        }
    });
});
app.get("/campgrounds/new",function(req,res){
    res.render("new");
});
//show more info about one campground

app.get("/campgrounds/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }
        else
        //render show template with that campground
       {
           console.log(foundCampground);
            res.render("show",{campgrounds: foundCampground});
        }
    });
   
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the yelcamp server has started");
});
