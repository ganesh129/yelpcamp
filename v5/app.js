var express   = require("express"),
 app          = express(),
 bodyparser   =require("body-parser"),
 mongoose     =require("mongoose"),
 Campground   =require("./models/campground"),
 Comment      =require("./models/comment"),
 seedDB       =require("./seeds"),
 passport=require("passport"),
 passportLocalMongoose=require("passport-local-mongoose"),
 LocalStrategy=require("passport-local"),
 User=require("./models/user");
 
 seedDB();
 //Passport configuration
 app.use(require("express-session")({
     secret:"heritage institute of technology",
     resave:false,
     saveUninitialized:false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 mongoose.connect("mongodb://localhost/Yel_camp_v5");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

app.get("/",function(req,res){
    res.render("landing");
    
});
app.get("/campgrounds",isLoggedIn, function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/Index",{campgrounds: allcampground,currntUser:req.user});
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
app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//show more info about one campground

app.get("/campgrounds/:id",isLoggedIn,function(req,res){
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
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } 
       else {
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
//----------
//Auth routes
//----------
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
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
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
});
//logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the yelcamp server has started");
});
