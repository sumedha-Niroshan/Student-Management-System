const express = require("express");
const bodyParser = require("body-parser");

const expressHandlebars = require("express-handlebars").engine;
require("dotenv").config();



const app = express();
const serverPort = process.env.SERVER_PORT || 3000;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//===================
const StudentRouter = require("./routes/StudentRoute");
const ProgrameRouter = require("./routes/ProgrameRoute");
const RegisterRouter = require("./routes/RigisterRoute");
//===================

app.use(express.static("public"));

app.engine(
  "hbs",
  expressHandlebars({
    extname: ".hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("view engine", ".hbs");

app.use("/" ,StudentRouter , ProgrameRouter, RegisterRouter);


app.listen(serverPort, () => {
  console.log(`Server Started & Running on port ${serverPort}`);
});
