const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    name: "rms",
    title: "Weather",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About myself",
    name: "rms",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "You can get some help here",
    title: "Help",
    name: "rms",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          location,
          address: req.query.address,
          forecast: forecastData,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    error: "Help article not found",
    title: "404 error",
    name: "rms",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    error: "Page not found",
    title: "404 error",
    name: "rms",
  });
});

app.listen(port, (req, res) => {
  console.log("server is up and running");
});
