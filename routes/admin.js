var express = require('express');
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
})

module.exports = router;
