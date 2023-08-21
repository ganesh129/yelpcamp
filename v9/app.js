 var express   = require("express"),
 app          = express(),
 bodyparser   =require("body-parser"),
 mongoose     =require("mongoose"),
 Campground   =require("./models/campground"),
 Comment      =require("./models/comment"),
 flash=require("connect-flash"),
 seedDB       =require("./seeds"),
 methodOverride=require("method-override"),
 passport=require("passport"),
 passportLocalMongoose=require("passport-local-mongoose"),
 LocalStrategy=require("passport-local"),
 User=require("./models/user");
 
// seedDB();    //seed the database
 
var campgroundRoutes=require("./routes/campgrounds");
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/index");
 //Passport configuration
 mongoose.connect("mongodb://localhost/Yel_camp_v8", {
    useMongoClient: true,
  });
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
 app.use(flash());
 //passport configuration
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
 
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
     res.locals.success=req.flash("success");
    next();
    
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);



app.listen(process.env.PORT || 5000, process.env.IP, function(){
    console.log("the yelcamp server has started",process.env.PORT, process.env.IP);
});
