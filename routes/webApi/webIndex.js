const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');

router.get('register', cors(), (req, res) => {
    console.log("abc");
    res.render('auth/register');
  });

router.get('login', cors(), (req, res) => {
    res.render('auth/login');
  });

module.exports = router;