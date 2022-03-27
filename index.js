var express = require("express");
var cors = require("cors");
var app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const port = 3000 || 3000;
const fs = require("fs");

app.use(cors());
app.use(express.static("public", { redirect: true }));

//configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/wtf", (req, res) => {
  console.log(req.body);
  fs.writeFileSync("public/" + req.body.path, req.body.input);
  res.send("200");
});

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port " + port);
});
