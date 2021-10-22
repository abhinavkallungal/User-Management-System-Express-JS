var express = require('express');
const adminHelpers = require('../helpers/adminHelpers');
var router = express.Router();
const userHelpers=require('../helpers/userHelpers');


/* GET home page. */
router.get('/', function(req, res){
  userHelpers.getUsers().then((users)=>{
    console.log(users);
    res.render('admin/adminHome',{admin:true,users});
  }).catch((message)=>{
    console.log(message);
    res.render('admin/adminHome',{admin:true,message});
  })
});

router.get('/login',function(req,res){
  res.render("admin/adminLogin")
});

router.post('/login',(req,res)=>{
  adminHelpers.login(req.body).then((response)=>{
    req.session.user=response.user;
    console.log("logedin");
    res.json({logedIn:true})
  }).catch((err)=>{
    res.json(err)
  })
});

module.exports = router;
