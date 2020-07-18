const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js");

require("dotenv").config();
const PORT = process.env.PORT;
const IP = process.env.IP;
const ACCESS_KEY = process.env.ACCESS_KEY;

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
/**
 * Root Route
 */
app.get("/", async function (req, res) {
  const imageCount = 1;
  let imageUrlArray = await getRandomImage("", imageCount);
  res.render("index", { imageUrlArray: imageUrlArray });
});

/**
 * Search Route
 */
app.get("/search", async function (req, res) {
  const imageCount = 9;
  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword; //req.query is used because GET method was used and keyword was used because that is the name of the input in the html form
  }

  let imageUrlArray = await getRandomImage(keyword, imageCount);
  res.render("results", { imageUrlArray: imageUrlArray });
});

/**
 * Update Favorites
 */
app.get("/api/updateFavorites", function (req, res) {
  let sql;
  let sqlParams;
  let keyword;
  switch (req.query.action) {
    case "add":
      sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
      // if a search without keyword is performed "random" is assigned to keyword
      keyword = req.query.keyword == "" ? "random" : req.query.keyword;
      // console.log(keyword);
      sqlParams = [req.query.imageUrl, keyword];
      break;
    case "delete":
      sql = "DELETE FROM favorites WHERE imageUrl = ?";
      sqlParams = [req.query.imageUrl];
      break;
  } //switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    // console.log(rows);
    res.send(rows.affectedRows.toString());
  });
}); //api/updateFavorites

/**
 * Get Keywords
 */
app.get("/getKeywords", async function (req, res) {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageUrlArray = await getRandomImage("random", 1);
  pool.query(sql, function (err, rows, fields) {
    if (err) throw err;
    // console.log(rows[1]);
    // console.log(typeof rows);
    res.render("favorites", { imageUrlArray: imageUrlArray, rows: rows });
  });
}); //getKeywords

/**
 * Api getFavorites
 */
app.get("/api/getFavorites", function (req, res) {
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    // console.log(rows);
    res.send(rows);
  });
}); //api/getFavorites

//starting server
app.listen(PORT, IP, function () {
  console.log("Express server is running...");
});

// functions
function getRandomImage(keyword, count) {
  return new Promise(function (resolve, reject) {
    let requestURL = `https://api.unsplash.com/photos/random/?count=${count}&client_id=${ACCESS_KEY}&featured=true&orientation=landscape&query=${keyword}`;

    request(requestURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let parsedData = JSON.parse(body);
        let imageUrlArray = [];
        for (let i = 0; i < count; i++) {
          imageUrlArray.push(parsedData[i]["urls"]["regular"]);
        }
        resolve(imageUrlArray); // resolve component of a promise
      } else {
        console.log("error:", error);
        console.log("statusCode:", response && response.statusCode);
        reject(error); // reject component of a promise
      }
    });
  });
}
