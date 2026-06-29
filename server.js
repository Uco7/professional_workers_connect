
const dns=require("dns/promises");
dns.setServers(["8.8.8.8","8.8.4.4"])

require("dotenv").config()
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const sessionMiddleware = require("./src/helperMildware/session");
const connectDb = require("./src/db/connectDb");
const getpage = require("./src/route/getRoute");
const postRoute = require("./src/route/postRoute");   

const app = express();
connectDb();
const PORT=process.env.PORT

// Middleware to parse URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use("/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(sessionMiddleware);

// Route handlers
app.use(getpage);
app.use(postRoute);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
