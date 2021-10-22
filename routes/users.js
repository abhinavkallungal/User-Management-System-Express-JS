const { response } = require('express');
var express = require('express');
var router = express.Router();
const userHelpers= require('../helpers/userHelpers')

const verifyLogin = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  if (req.session.user) {
   next()
  } else {
    res.redirect("/login");
  }
};

const checkSession= (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next()

  }
};




/* GET users listing. */
router.get('/', verifyLogin,function(req, res) {
  res.render('user/userHome',{user:true});
});
router.get('/login',checkSession,(req,res)=>{
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  

res.render('user/userLogin');
});


router.post('/login',checkSession,(req,res)=>{
  console.log("1");
  userHelpers.login(req.body).then((response)=>{
    req.session.user = response.user;
    res.json({logedIn:true})
  }).catch((err)=>{
    res.json(err)
  })
});

router.get('/signup',checkSession,(req,res)=>{
  res.render('user/userSignup');
});

router.post('/signup',checkSession,async(req,res)=>{
  let result={}
  email=req.body.email;

  await userHelpers.checkEmailExist(email).then((response)=>{
    result.emailExist=response;
    console.log(response);
  }).catch((err)=>{
    result.emailExist=err;
    console.log(err);
  })


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
  
  if(result.emailVerification.error===false && result.passwordVerification.error===false && result.confirmPasswordVerification.error===false && result.emailExist.error===false){
    userHelpers.signUp(req.body).then((response)=>{
      result.logedIn=response
      req.body.status=true;
      req.session.user=req.body;
      res.json(result)
    }).catch((err)=>{
      result.logedIn=false
      res.json(result)
    })
  }else{
    console.log(result);
    res.json(result)

  }

});

router.get('/logout',verifyLogin,(req,res)=>{
  req.session.destroy()
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  res.redirect('/login');
})




module.exports = router;
