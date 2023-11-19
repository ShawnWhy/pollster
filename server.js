const express = require("express");
var path = require("path");
const app = express();
var port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "colorpiano",
});

// connection.query(
//     "SELECT * FROM choices where pollid = 1",
    
//     function (err, data) {
//       if (err) throw err;
//       console.log(data);
    
//     }
//   );
app.get("/api/getAllPoll/", function (req, res) {
  console.log("getting all/ poll");

  connection.query(
    "SELECT * FROM polls",
   
    function (err, data) {
      if (err) throw err;
      console.log(data);
      res.json(data);
    }
  );
});

app.get("/api/getpoll/:id", function (req, res) {
  console.log("getting poll");
  var id = req.params.id
  console.log(id)
  connection.query("SELECT * FROM polls where id = ?",[id], function (err, data) {
    if (err) throw err;
    console.log(data)
    res.json(data);
  });
});
app.get("/api/getchoices/:id", function (req, res) {
  console.log("getting choices");
  var id = req.params.id;
  connection.query(
    "SELECT * FROM choices where pollid = ? ",
    [id],
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});

app.get("/api/getvotes/:id", function (req, res) {
  console.log("getting votes");
  var id = req.params.id;
  connection.query(
    "SELECT count(choiceid) as count, choiceid FROM votes where  pollid = ? group by choiceid",
    [id],
    function (err, data) {
      if (err) throw err;
      res.json(data);
      console.log(data);

    }
  );
});

app.post("/api/poll", function (req, res) {
  console.log(req.body);
  connection.query(
    "INSERT INTO polls (pollquestion) values(?)",
    [req.body.text],
    function (err, data) {
      if (err) throw err;
      console.log(data);
      res.json(data);
    }
  );
});

app.post("/api/choices/", function (req, res) {
  console.log(req.body);
  connection.query(
    "INSERT INTO choices (choicetext, pollid) values(?,?)",
    [req.body.text, req.body.pollid],
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});

app.post("/api/votes/", function (req, res) {
  console.log("posting votes")
  console.log(req.body);
  connection.query(
    "INSERT INTO votes (choiceid, pollid) values(?,?)",
    [req.body.choiceid, req.body.pollid],
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});
