const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/Users');

//Regestration page
router.get('/register',(req,resp)=>{
    resp.render('register');
});

//Login Page
router.get('/login',(req,resp)=>{
    resp.render('login');
});


//Register Handler POST request

router.post('/register',(req,res)=>{
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   const password2 = req.body.password2;
    let errors = [];
    
    //Check Required fileds
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fiels'});
    }

    //Check password match
    if(password!==password2){
        errors.push({msg:'Password do not match'});
    }

    //Check password length
    if(password.lengh<6){
        errors.push({msg:'Password should be atleast 6 characters long'});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
       //Validation passed
        User.findOne({email:email})
        .then(user=>{
            if(user){
                //User Exists
                errors.push({msg:'Email is already registered!'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }

            else{

                const newUser = new User({name,email,password});
                //Hashed Password

                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{

                        if(err) throw err;
                        //set password to hashed
                        newUser.password = hash;

                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now successfully registered. And can login');
                            res.redirect('/users/login');
                        })
                        .catch(err=>console.log(err));
                    });
                });

               
                
                
            }
        })
        .catch(err=>console.log(err));
    }



});

//Login Handler Post Request
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
            successRedirect:'/dashboard',
            failureRedirect:'/users/login',
            failureFlash:true
    })(req,res,next);

});


//Logout Handler

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are successfully logged out.');
    res.redirect('/users/login');
});

module.exports = router;