var express = require('express');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var sass    = require('node-sass')
var routes = require('./routes/index');
//var users = require('./routes/users');
var gulp = require('gulp');
//var sass = require('gulp-sass');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// local passport stratgy code starts
app.use(expressSession({
  secret:"yes sir",
  resave:true,
  saveUnintialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
var User = require("./models/users/user");
passport.use(new LocalStrategy(function(username,password,done){
  //console.log("username -  " + username + "  - password -- "  + password);
  User.findOne({where:{email:username,password:password}}).then(function(pro){
    if(pro){
      console.log("local success")
      done(null,pro);
    }
    else{
      console.log("local error")
      done("error",null);
    }

  });
}))

//passport.use(User.createStrategy());
passport.serializeUser(function(user,done){
  console.log("serialize");
  done(null,user);
});
passport.deserializeUser(function(user,done){
  console.log("deserialize");
  done(null,user);

});


// ends
console.log("dir name  ",__dirname);
// following code will compile saas files into css
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
