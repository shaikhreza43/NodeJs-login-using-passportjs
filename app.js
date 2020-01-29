const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

const app = express();
const port = process.env.PORT|| 8000;

//Passport Config
require('./config/passport')(passport);


//MongoDb Atlas Connect
const db = require('./config/keys');
mongoose.connect(db.ATLAS_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log('Successfully connected to MongoDb Atlas')})
.catch(err=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser

app.use(express.urlencoded({extended:false}));


//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));


  //Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
  app.use(flash());


  //Global variables
  app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(port,()=>console.log(`Server is listening to port ${port}`));