module.exports={
    ensureAuthenticated:function(req,resp,next){
        if(req.isAuthenticated()){
           return next();
        }

        req.flash('error_msg','Please login to view the resource');
        resp.redirect('/users/login');
    }
}