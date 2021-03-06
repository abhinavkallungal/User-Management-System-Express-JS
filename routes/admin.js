var ObjectId = require('mongodb').ObjectID
var express = require('express');
const adminHelpers = require('../helpers/adminHelpers');
var router = express.Router();
const userHelpers = require('../helpers/userHelpers');


const verifyLogin = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  if (req.session.admin) {
    next()
  } else {
    res.redirect("/admin/login");
  }
};

const checkSession = (req, res, next) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    next()

  }
};


/* GET home page. */
router.get('/', verifyLogin, function (req, res) {

  userHelpers.getUsers().then((users) => {
    res.render('admin/adminHome', { admin: true, users, title: " Admin  Dashboard" });
  }).catch((message) => {
    res.render('admin/adminHome', { admin: true, message, title: " Admin  Dashboard" });
  })
});



router.get('/login', checkSession, function (req, res) {
  res.render("admin/adminLogin", { title: " Admin  Login" })
});

router.post('/login', checkSession, (req, res) => {
  adminHelpers.login(req.body).then((response) => {
    req.session.admin = response.user;
    res.json({ logedIn: true })
  }).catch((err) => {
    res.json(err)
  })
});

router.post('/deleteUser/', verifyLogin, (req, res) => {
  let id = req.body.id
  userHelpers.deleteUser(id).then(() => {
    res.redirect('/admin/')
  })
});

router.get('/editUser/:id', verifyLogin, (req, res) => {
  let id = req.params.id
  userHelpers.getUser(id).then((userDetails) => {
    res.render('admin/editUser', { admin: true, userDetails, title: " Edit User" });
  }).catch(() => {
    res.redirect("/admin/");
  })

});

router.post('/editUser/', verifyLogin, async (req, res) => {
  console.log("Dfasdfas");
  let emailCheck = false;
  let emailExistCheck = false;

  await userHelpers.checkEmail(req.body.email).then(() => {
    emailCheck = true
    console.log("Dfasdfas2");

  }).catch((err) => {
    emailCheck = false;
    console.log("Dfasdfas3");

    res.json(err);
  });
  console.log("Dfasdfas4");


  await userHelpers.checkEmailExist(req.body.email).then((response) => {

    emailExistCheck = true
    console.log("Dfasdfas5");

  }).catch((err) => {
    console.log("Dfasdfas6");

    if (req.body.id === err.id.toString()) {
      emailExistCheck = true
      console.log("Dfasdfas7");

    } else {
      console.log("Dfasdfas8");
      emailExistCheck = false
      res.json({
        message: 'Email already Exist',
        error: true
      });


    }

  })
  console.log("Dfasdfas9");


  if (emailExistCheck === true && emailCheck === true) {
    console.log("Dfasdfas10");
    userHelpers.editUser(req.body).then(() => {
      console.log("Dfasdfas11");

      res.json({ edited: true })
    }).catch((err) => {
      console.log("Dfasdfas12");
      console.log(err);
    })
  } else {
    console.log("Dfasdfas13");
    res.json({
      message: 'Editing have a Problum',
      error: true
    });


  }

});


router.get('/addUser', verifyLogin, (req, res) => {
  res.render('admin/addUser', { admin: true, title: "Add User" })
});

router.post('/addUser', verifyLogin, async (req, res) => {
  let result = {}
  email = req.body.email;

  await userHelpers.checkEmailExist(email).then((response) => {
    result.emailExist = response;
  }).catch((err) => {
    result.emailExist = err;
  })


  await userHelpers.checkEmail(email).then((response) => {
    result.emailVerification = response;
  }).catch((err) => {
    result.emailVerification = err;
  })

  result.passwordVerification = false;
  password = req.body.password;
  await userHelpers.checkPassword(password).then((response) => {
    result.passwordVerification = response;
  }).catch((err) => {
    result.passwordVerification = err;
  })


  result.confirmPasswordVerification = false;
  if (result.passwordVerification) {
    if (req.body.password === req.body.confirmPassword) {
      result.confirmPasswordVerification = { error: false };
    } else {
      result.confirmPasswordVerification = { error: true, message: "The password and confirmation password do not match " };
    }
  }

  if (result.emailVerification.error === false && result.passwordVerification.error === false && result.confirmPasswordVerification.error === false && result.emailExist.error === false) {
    userHelpers.signUp(req.body).then((response) => {
      result.logedIn = response
      req.body.status = "Active";
      req.session.admin = req.body;
      res.json(result)
    }).catch((err) => {
      result.logedIn = false
      res.json(result)
    })
  } else {
    res.json(result)

  }

});


router.get('/logout', (req, res) => {
  req.session.admin = null
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.redirect('/admin/login');
})


module.exports = router;
