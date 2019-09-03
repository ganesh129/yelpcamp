var mongoose= require("mongoose");
var Campground=require("./models/campground"),
      Comment=require("./models/comment");

var data=[
   { name:"ganesh",
       image:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
       description:"nice place,i have been there for long time ,nice experience"
   },
       
   {
       name:"bittu",
       image:"https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg",
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
});
}

 
module.exports=seedDB;