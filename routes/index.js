var express = require('express');
var router = express.Router(),
    User = require("../models/users/user"),
    Fred = require("../models/fred"),
    passport = require("passport"),
    Utills = require("../connection/utills");

//var pgClient = require('../connection/users')


function isAuthenticate(req,res,next){
    if(req.isAuthenticated()){
        console.log("true")
        next(req,res);
        return true;
    }
    else{
        console.log("false")
       res.send(503);
    }
    //return false;
}
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        console.log("user details :" ,req.user.name)
        res.render("index",{username:req.user.name});
    }
    else{
        res.redirect("/login");
    }

});
// find all users
router.get('/users', function(req, res, next) {
    if(true) {
        var searchTerm = req.query.searchTerm;
        console.log("inside users")
        var options = {
            attributes: ['name', 'id'],
            where: {
                name: {
                    $iLike: '%' + searchTerm + '%'
                }
            }
        };

        User.findAll(options).then(function (data) {
            // console.log(data);
            res.send(data);
        })
    }
    else{
        res.send(401);
    }
});

router.all('/savepoint', function(req, res) {
    if(req.isAuthenticated()) {
        var currentUserId = req.user.id;
        var body = req.body;
        console.log(req.body)
        var friendly = [],
            ids = req.body.friendly,
            oDate = Utills.Date.getStartEnd(10, 25);
        for (var i = 0; i < ids.length; i++) {
            friendly.push({nominator: "1", nominated: ids[i]})
        }
        console.log(oDate);
        if (ids.length > 0) {
            Fred.F.findAll({
                where: {
                    createdAt: {
                        $lt:oDate.end,
                        $gt:oDate.start
                    }
                }
            }).then(function (data) {

                if (data.length == 0) {
                    Fred.F.bulkCreate(friendly).then(function () {
                        res.send("success")
                    });
                }
                else {
                    res.send("error")
                }
            });
        }
    }
    else{
        res.send(401);
    }

});
router.get('/signUp', function(req, res, next) {
  res.render('createApk', { title: 'Express' });
});

/* GET Login page. */
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect("/");
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* Post Login page. */
router.post('/login',passport.authenticate("local",{failureRedirect:"/login"
}), function(req, res) {
    console.log("next called");
    res.send("success");
});


router.get('/createUser',function(req,res){
  var query = req.query;
    console.log(query)
    console.log(User)
   User.create({
        name:query.name,
        email:query.email,
        mobile:query.mobile,
        password:query.password,
    }).then(function(resp){
       resp.save();
       res.send({success:true})
   })

})
module.exports = router;
