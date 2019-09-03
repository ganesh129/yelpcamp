var express   = require("express"),
 app          = express(),
 bodyparser   =require("body-parser"),
 mongoose     =require("mongoose");
 mongoose.connect("mongodb://localhost/Yel_camp");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var Campground=require("./models/campground");
//SETUP SCHEMA

Campground.create({
   name:"ganesh",
   image:"https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
   description:"horror place .no bathrooms.stay safe"
}, function(err, campground){
    if(err){
        console.log("something went wrong");
       console.log(err);
    }
    else
    {
        console.log(campground);
    }
});


 //var campgrounds = [
  //      {name: "ganesh", image: "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg"},
  //      {name : "aman", image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144593f4c57ea5e9b1_340.jpg"},
   //     {name: "ghoda", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg"}
   // ];
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
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }
        else
       {
            res.render("show",{campgrounds: foundCampground});
        }
    });
   
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the yelcamp server has started");
});
