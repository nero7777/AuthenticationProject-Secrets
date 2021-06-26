//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10;

//creating and using express constructor using app variable
const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//connecting to database
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true})

//creating user for DB
const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = new mongoose.model("User",userSchema);

//get routes
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

//post routes to get data
app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
         //creating user model and assigning values of email and password from the body
    const newUser = new User({
        email : req.body.username,
        password : hash
    })
   //saving the created user in database
        newUser.save(function(err){
            if(err){
             console.log(err)
            }else{
                res.render("secrets")
            }
        });
    });

   
})
app.post("/login",function(req,res){
    //destructuring the req.body to get username and password for login
    const username = req.body.username;
    const password = req.body.password;

    //finding the user with the email specified and checking if the password matches
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets")
                    }
                });
            }
        }
    })
})




//for starting the server listening on some port to start serving the client
app.listen(3000,function(req,res){
    console.log("Server is up and running on port 3000");
})