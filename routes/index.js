var express = require('express');
const passport = require('passport');
const users = require('./users');
var router = express.Router();


const localuser = require("passport-local");
passport.use(new localuser(users.authenticate()));

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/profile" , isLoggegIn,function(req,res,next){
  users.findOne({username:req.session.passport.user})
  .then(function(foundUser){
    res.render("profile" , {foundUser})
  })
});

router.get("/delete/:id" , isLoggegIn, function(req,res,next){
  users.findOneAndDelete({id:req.params.id})
  .then(function(deleteduser){
   res.redirect(req.headers.referer);
  })
});
router.get("/allusers",isLoggegIn ,function(req,res,next){
  users.find()
  .then(function(allusers){
   res.render("allusers" , {allusers:allusers})
  })
} )

 /*router.get('/register', function(req, res, next) {
  res.render('register');
}); 
*/

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/register' , function(req,res,next){
  var newuser = new users({
    name: req.body.name,
    username:req.body.username,
    email:req.body.email,  
  })
  users.register(newuser ,req.body.password)
  .then(function(registerduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect("/profile")
    })
  })
  .catch(function(err){
       res.send(err);
   
  })
})


router.post("/login" , passport.authenticate("local" , {
  successRedirect : "/profile",
  failureRedirect :"/login"
}),function(req,res){})


router.get("/logout" , function(req,res){
   req.logOut(function(err){
    if(err)
    throw err;
    res.redirect("/login");
   });
 
})


function isLoggegIn(req,res,next){
  if(req.isAuthenticated()){
   return next();
  }
 else{
  res.redirect("/login");
 }
}

module.exports = router;
