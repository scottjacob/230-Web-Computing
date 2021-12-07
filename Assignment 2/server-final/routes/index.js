const express = require("express");
const mysql = require("mysql");
var router = express.Router();
const knex_options = require("../knexfile");
const knex = require("knex")(knex_options);

const jwt = require('jsonwebtoken');
const secret = require("../key.json");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect('/docs');
});


router.get("/stocks", function (req, res, next) {
  res.status(400).json({
    error: true,
    message: "stock symbol must be between 1-5 capital letters"
  })

});


/* GET - Stock by industry */
router.get("/stocks/symbols?:industry", (req, res, next) => {

  if (Object.keys(req.query).length === 0) {
       knex('stocks')
      .distinct('name', 'symbol', 'industry')
      .then((rows) => {
        res.json(rows);
      })
      .catch((err) => {
        res.json({
          error: true,
          message: "Error executing query",
        });
      });
  } else if (req.query.industry === undefined) {
    return res.status(400).json({
      error: true,
      message: "Invalid Industry"
    })
  } else {
      knex('stocks')
      .distinct("name", "symbol", "industry")
      .from("stocks")
      .where("industry", "LIKE", `%${req.query.industry}%`)
      .then((rows) => {
        if (rows.length === 0){
          return res.status(404).json({
            error: true,
            message: "Industry Not Found"
          })
        }
        res.json(rows);
      })
      .catch((err) => {
        res.json({
          error: true,
          message: "Error executing query",
        });
      });
  }
});


/* GET - stock by symbol, grabs first entry in array */
router.get("/stocks/:symbol", (req, res, next) => {

  // Check if in db
  const symbolSearch = req.params.symbol;

  if (!symbolSearch) {
    return res.status(400).json({
      error: true,
      message: "Request incomplete - symbol needed"
    })
  }

  if (Object.keys(req.query).length > 1) {
    return res.status(400).json({
      error: true,
      message: "Too many parameters"
    })
  }

  knex('stocks')
    .first("name", "symbol", "industry", "timestamp", "open", "high", "low", "close", "volumes")
    .where("symbol", "=", req.params.symbol)
    .then((rows) => {

      if (rows === undefined) {
        throw (err)
      }
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).json({
        error: true,
        message: "No stock found in database",
      });
    });
});


/* Check if authenticated */
const authorize = (req, res, next) => {

  const authorization = req.headers.authorization;
  const key = secret.secretKey;
  let token = null;

  // Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1]
    //console.log("Token: ", token);
  } else {
    return res.status(403).json({ error: true, message: "Authorization Header Error" })
  }

  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, key)

    if (decoded.exp > Date.now()) {
      // console.log("Token has expired")
      return res.status(400).json({ error: true, message: "jwt token expired" })
    }

    // Permit user to advance to route
    next()
  } catch (e) {
    return res.status(403).json({ error: true, message: "jwt malformed" })
    // console.log("Token is not valid: ", err)
  }
}



/* GET - AUTHENTICATED PRICE HISTORY */
// "/stocks/authed/:symbol?from=:from&to=:to"
// /^\/stocks\/authed(?:\/([^\/]+?))?from=(?:([^\/]+?))&to=(?:([^\/]+?))\/?$/i - regex exp
router.get("/stocks/authed/:symbol", authorize, (req, res, next) => {

  if (req.query.from === undefined || req.query.to === undefined) {
    return res.status(400).json({
      error: true,
      message: "Incorrect query"
    })
  }
  
  // parse dates to ISO format
  let fromDate = new Date(req.query.from).toISOString();
  let toDate = new Date(req.query.to).toISOString();
  console.log(req.params.symbol, fromDate, toDate);

  

  // Validate symbol exists in db
  try {
    knex('stocks').select('name').where('symbol', '=', req.params.symbol)
    .then((result) => {
      if (result === null || result.length === 0) {
        throw(err)
      }
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Symbol does not exist"
      })
    })
  } catch (error) {
    return console.error(error);
  }
  knex('stocks')
    .select("name", "symbol", "industry", "timestamp", "open", "high", "low", "close", "volumes")
    .where("symbol", "=", req.params.symbol)
    .whereBetween("timestamp", [fromDate, toDate])
    .then((rows) => {

      if (rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No results in given date-range"
        })
      }
      res.json(rows);
    })
    .catch((err) => {
      return res.json({
        error: true,
        message: "Error executing query",
      });
    });
});




module.exports = router;
