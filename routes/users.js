var express = require('express');
var router = express.Router();
const userHelpers= require('../helpers/userHelpers')

const verifyLogin = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  if (req.session.user ) {
    userHelpers.checkStatus(req.session.user._id).then((user)=>{
      if(user){
      if( user.status==="Active" && user.email===req.session.user.email){
        next()
      }else{
        res.redirect("/login");
      }
    }else{
      res.redirect("/login");
    }
    })
  } else {
    res.redirect("/login");
  }
};

const checkSession= (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  if (req.session.user) {
    userHelpers.checkStatus(req.session.user._id).then((user)=>{

      if(user){

        if(user.status==="Active" && user.email===req.session.user.email){
          res.redirect('/');
        }else{
          next()
        }
      }else{
        next()

      }
      
    }).catch(()=>{
      next()
    })
  } else {
    next()
  }
};




/* GET users listing. */
router.get('/', verifyLogin,function(req, res) {
  res.render('user/userHome',{user:true,title:"Home Page"});
});

router.get('/test', verifyLogin,function(req, res) {
  res.render('user/userTest',{user:true,title:"Test Page"});
});

router.get('/login',checkSession,(req,res)=>{
 
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
    res.render('user/userLogin',{title:"Login Page"});
  
 
});


router.post('/login',checkSession,(req,res)=>{
  userHelpers.checkEmail(req.body.email).then(()=>{
    userHelpers.checkBlock(req.body.email).then(()=>{
      userHelpers.login(req.body).then((response)=>{
        req.session.user = response.user;
        res.json({logedIn:true})
      }).catch((err)=>{
        res.json(err)
      })

    }).catch((err)=>{
      res.json(err)
    })
    
  }).catch((err)=>{
    res.json({message:"Please enter a valid email address.",logedIn:false})
  })
  
});

router.get('/signup',checkSession,(req,res)=>{

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
    res.render('user/userSignup',{title:"Home Page"});
  
});

router.post('/signup',checkSession,async(req,res)=>{
  let result={}
  email=req.body.email;

  await userHelpers.checkEmail(email).then((response)=>{
    result.emailVerification=response;
  }).catch((err)=>{
    result.emailVerification=err;
  })

  await userHelpers.checkEmailExist(email).then((response)=>{
    result.emailExist=response;
  }).catch((err)=>{
    result.emailExist=err;
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
      req.body.status="Active";
      req.body._id=response.insertedId
      req.session.user=req.body;
      res.json(result)
    }).catch((err)=>{
      result.logedIn=false
      res.json(result)
    })
  }else{
    res.json(result)

  }

});

router.get('/logout',verifyLogin,(req,res)=>{
  req.session.user=null;
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  res.redirect('/login');
})




module.exports = router;
