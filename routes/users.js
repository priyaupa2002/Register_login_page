
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/kuchbhi");

var plm = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  name: String,
  email:String,
  username:String,
  password:String,

})

userSchema.plugin(plm);
module.exports = mongoose.model("user" , userSchema);

