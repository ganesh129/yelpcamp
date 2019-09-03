var mongoose= require("mongoose");
var Campground=require("./models/campground"),
      Comment=require("./models/comment");

var data=[
   { name:"ganesh",
       image:"https://pixabay.com/get/ea32b6062afc013ed1584d05fb1d4e97e07ee3d21cac104490f0c37da6e4b2bf_340.jpg",
       description:"nice place,i have been there for long time ,nice experience"
   },
       
   {
       name:"bittu",
       image:"https://pixabay.com/get/e83db80d2cfd053ed1584d05fb1d4e97e07ee3d21cac104490f0c37da6e4b2bf_340.jpg",
       description:"brothers place"
       
   }
  
    
    ];
//remove all campgrounds
function seedDB(){
    Campground.remove({},function(err){
        if(err)
        {
            console.log(err);
        }
        console.log("campgrounds removed");
    });
}
//adding campground for each object present in data
data.forEach(function(seed){
     Campground.create(seed, function(err,campground){
         if(err)
         {
             console.log(err);
         }
         else
         {
             console.log("added a campground");
             //adding comment for each campground
             Comment.create(
                 {
                     text:"i wish there was internet",
                     author:"raju"
                 },function(err,comment)
                 {
                     if(err)
                     {
                         console.log(err);
                     }
                     else
                     {
                         campground.comments.push(comment);
                         campground.save();
                         console.log("comment created");
                     }
                 });
         }
     });
    
});
 
module.exports=seedDB;