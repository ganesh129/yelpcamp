var mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
    username:String,
    password:String
    
    
});
//passportlocalmongoose package add some useful predefined methods to schema.
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);