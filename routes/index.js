const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../config/auth');

//Welcome page
router.get('/',(req,resp)=>{
    resp.render('welcome');
});

//Dashboard page
router.get('/dashboard',ensureAuthenticated,(req,resp)=>{
    resp.render('dashboard',{
        name:req.user.name
    });
});




module.exports = router;