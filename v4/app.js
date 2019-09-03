var express   = require("express"),
 app          = express(),
 bodyparser   =require("body-parser"),
 mongoose     =require("mongoose"),
 Campground   =require("./models/campground"),
 Comment      =require("./models/comment"),
 seedDB       =require("./seeds");
 
 seedDB();
 
 mongoose.connect("mongodb://localhost/Yel_camp_v5");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));

app.get("/",function(req,res){
    res.render("landing");
    
});
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/Index",{campgrounds: allcampground});
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
    res.render("campgrounds/new");
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
           console.log(foundCampground,"Hii");
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
   
});

//create comment new routes
app.get("/campgrounds/:id/comments/new",function(req,res){
    //find byid
    Campground.findById(req.params.id,function(err,requiredcampground){
        
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground:requiredcampground});
    
            
        }
    })
    
});
app.post("/campgrounds/:id/comments", function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the yelcamp server has started");
});
