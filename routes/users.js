var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('user/userHome');
});
router.get('/login',(req,res)=>{
res.render('user/userLogin');
})

module.exports = router;
