var express = require('express');
var router = express.Router();
const userHelpers= require('../helpers/userHelpers')

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('user/userHome');
});
router.get('/login',(req,res)=>{
res.render('user/userLogin');
});

router.get('/signup',(req,res)=>{
  res.render('user/userSignup');
});
router.post('/signup',(req,res)=>{
  userHelpers.signUp(req.body)
})

router.post('/checkemail',(req,res)=>{

})

module.exports = router;
