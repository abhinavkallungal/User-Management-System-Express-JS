const { response } = require('express');
var express = require('express');
const { checkEmail } = require('../helpers/userHelpers');
var router = express.Router();
const userHelpers= require('../helpers/userHelpers')

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('user/userHome');
});
router.get('/login',(req,res)=>{
res.render('user/userLogin');
});

router.post('/login',(req,res)=>{
  userHelpers.login(req.body).then((response)=>{
    req.session.user=response.user;
    res.redirect('/');
  }).catch((err)=>{
    res.redirect('/login');
  })
});

router.get('/signup',(req,res)=>{
  res.render('user/userSignup');
});

router.post('/signup',async(req,res)=>{
  console.log("test1");
  let emailVerification =false;
  email=req.body.email
  console.log(email.trim());
  await userHelpers.checkEmail(email).then((response)=>{
    emailVerification=true;
    console.log("test2");
  }).catch((err)=>{
    emailVerification=false;
  })

  let passwordVerification=false;
  password=req.body.password;
 await userHelpers.checkPassword(password).then((response)=>{
    console.log("test3");
    passwordVerification=true;
  }).catch((err)=>{
    console.log("test4");
      passwordVerification=false;
  })

  let  confirmPasswordVerification=false;


  if(passwordVerification){
    console.log("test5");

    if(req.body.password===req.body.confirmPassword){
      console.log("test6");
      confirmPasswordVerification=true;
    }else{
      console.log("test7");
      confirmPasswordVerification=false;
    }
  }else{
    console.log("test8");

  }
  
  if(emailVerification && passwordVerification && confirmPasswordVerification ){
    userHelpers.signUp(req.body).then((response)=>{
      console.log("response",response);
      res.redirect('/');
    }).catch((err)=>{
      console.log("err",err);
      res.redirect('/signup');
    })
  }else{
    res.redirect('/signup')

  }

});

router.get('/logout',(req,res)=>{
  req.session.user=null;
  res.redirect('/login');
})



module.exports = router;
