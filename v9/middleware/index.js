var Campground=require("../models/campground");
var Comment=require("../models/comment");
var flash=require("connect-flash");
var middlewareobj={};

middlewareobj.checkCampgroundOwnership=function(req,res,next)
{
    if(req.isAuthenticated()){
          Campground.findById(req.params.id,function(err, foundCampground){
      
        if(err){
            req.flash("error",err);
            res.redirect("back");
        }
        else
        {
             if(foundCampground.author.id.equals(req.user._id)){
             next();
             }else{
             res.redirect("back");
             }
        }
    });
      }else
      {
         req.flash("error","you don't have permission to do that");
          res.redirect("back");
      }
}
middlewareobj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","campground not found");
                res.redirect("back");
            }else
            {     
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else
                {
                    req.flash("error","you do'nt have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","something went wrong");
        res.redirect("back");
    }
}
middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login first");
    res.redirect("/login");
}

module.exports=middlewareobj;