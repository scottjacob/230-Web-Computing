var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const knex_options = require("../knexfile");
const knex = require("knex")(knex_options);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = require("../key.json");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST - User register */
router.post("/register", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  //console.log(email, password);
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }

  const queryUsers = knex.from("users").select("*").where("email", "=", email)
  queryUsers
    .then((users) => {
      if (users.length > 0) {
        return res.status(409).json({ error: true, message: "User already exists" })
      }

      // insert user into db
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      return knex.from("users").insert({ email, hash })
    })
    .then(() => {
      return res.status(201).json({ success: true, message: "User created" })
    })
});

/* POST - user login */
router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }
  const queryUsers = knex.from("users").select("*").where("email", "=", email);
  queryUsers
    .then((users) => {
      if (users.length === 0) {
        return res.status(401).json({ error: true, message: "Incorrect password" })
      }

      // compare hashes
      const user = users[0];
      return bcrypt.compare(password, user.hash)
    })
    .then((match) => {
      if (!match) {
        return res.status(401).json({ error: true, message: "Incorrect password" })
      }

      // create and return JWT token
      const key = secret.secretKey // must remain secret --TODO - return from file
      const expires_in = 60 * 60 * 24 // 1 day
      const exp = Math.floor(Date.now() / 1000) + expires_in
      const token = jwt.sign({ email, exp }, key)
      res.json({ token_type: "Bearer", token, expires_in })
    })
})

module.exports = router;
