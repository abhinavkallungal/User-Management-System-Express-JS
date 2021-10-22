const { response } = require('express');
var express = require('express');
var router = express.Router();
const userHelpers= require('../helpers/userHelpers')

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('user/userHome',{user:true});
});
router.get('/login',(req,res)=>{
res.render('user/userLogin');
});

router.post('/login',(req,res)=>{
  userHelpers.login(req.body).then((response)=>{
    req.session.user=response.user;
    console.log("logedin");
    res.json({logedIn:true})
  }).catch((err)=>{
    res.json(err)
  })
});

router.get('/signup',(req,res)=>{
  res.render('user/userSignup');
});

router.post('/signup',async(req,res)=>{
  let result={}
  result.emailVerification =false;
  email=req.body.email;

  await userHelpers.checkEmail(email).then((response)=>{
    result.emailVerification=response;
  }).catch((err)=>{
    result.emailVerification=err;
  })

  result.passwordVerification=false;
  password=req.body.password;
 await userHelpers.checkPassword(password).then((response)=>{
    result.passwordVerification=response;
  }).catch((err)=>{
     result.passwordVerification=err;
  })


  result.confirmPasswordVerification=false;
  if(result.passwordVerification){
    if(req.body.password===req.body.confirmPassword){
      result.confirmPasswordVerification={error:false};
    }else{
      result.confirmPasswordVerification={error:true,message:"The password and confirmation password do not match "};
    }
  }
  
  if(result.emailVerification.error===false && result.passwordVerification.error===false && result.confirmPasswordVerification.error===false ){
    userHelpers.signUp(req.body).then((response)=>{
      result.logedIn=response
      req.session.user=req.body;
      console.log(result);
      res.json(result)
    }).catch((err)=>{
      result.logedIn=false
      console.log(result);
      res.json(result)
    })
  }else{
    console.log(result);
    res.json(result)

  }

});

router.get('/logout',(req,res)=>{
  req.session.user=null;
  res.redirect('/login');
})



module.exports = router;
