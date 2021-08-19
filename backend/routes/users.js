const express = require('express');
const router = express.Router();
const AuthController = require('./../controller/AuthController')
const AuthToken = require('./../middleware/auth')
const path = require('path');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',  async function (req, res, next) {
  let data = await AuthController.register(req, res)
  res.send(data)
})

router.get('/verify', async function (req, res, next) {
  let data = await AuthController.conformmail(req, res);
  res.send(data);
})

router.post('/login', async function (req, res, next) {
  let data = await AuthController.login(req, res);
  res.send(data);
})

router.post('/update', AuthToken, async function (req, res, next) {
  let data = await AuthController.update(req, res)
  res.send(data)
})

router.post('/chamgepassword', AuthToken, async function (req, res, next) {
  let data = await AuthController.changepassword(req, res)
  res.send(data)
})

router.get('/fogotpassword', async function (req, res) {
  res.sendFile(path.resolve('./views/forgotpassword.html'))
})

router.post('/forgotpasswordrequest', async function (req, res) {
  let data = await AuthController.forgotpasswordrequest(req, res)
  res.send(data)
})

router.post('/forgotpage', async function (req, res) {
  let data = await AuthController.forgotpassword(req, res)
  res.send(data)
})
module.exports = router;
