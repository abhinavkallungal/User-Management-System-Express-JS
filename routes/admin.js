var express = require('express');
const adminHelpers = require('../helpers/adminHelpers');
var router = express.Router();
const userHelpers=require('../helpers/userHelpers');


const verifyLogin = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  if (req.session.admin) {
   next()
  } else {
    res.redirect("/admin/login");
  }
};

const checkSession= (req, res, next) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    next()

  }
};


/* GET home page. */
router.get('/', verifyLogin, function(req, res){
  
  userHelpers.getUsers().then((users)=>{
    console.log("test2");
    res.render('admin/adminHome',{admin:true,users});
  }).catch((message)=>{
    res.render('admin/adminHome',{admin:true,message});
  })
});



router.get('/login',checkSession,function(req,res){
  res.render("admin/adminLogin")
});

router.post('/login',checkSession,(req,res)=>{
  adminHelpers.login(req.body).then((response)=>{
    req.session.admin=response.user;
    console.log("logedin");
    res.json({logedIn:true})
  }).catch((err)=>{
    res.json(err)
  })
});

router.get('/deleteUser/:id',verifyLogin,(req,res)=>{
    let id = req.params.id
    console.log(id);
    userHelpers.deleteUser(id).then(()=>{
      res.redirect('/admin/')
    })
});

router.get('/editUser/:id',verifyLogin,(req,res)=>{
  let id = req.params.id
  userHelpers.getUser(id).then((userDetails)=>{
    res.render('admin/editUser',{admin:true,userDetails});
  }).catch(()=>{
    res.redirect("/admin/");
  })
  
});

router.post('/editUser/',verifyLogin, (req,res)=>{
    userHelpers.editUser(req.body).then(()=>{
      res.redirect('/admin/');
    })
});
router.get('/addUser',verifyLogin,(req,res)=>{
  res.render('admin/addUser',{admin:true})
});

router.post('/addUser',verifyLogin,async(req,res)=>{
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
      req.body.status="Active";
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


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');  
  res.redirect('/admin/login');
})


module.exports = router;
