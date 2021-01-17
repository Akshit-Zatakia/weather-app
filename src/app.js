const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// use for static pages
const publicDirectory = path.join(__dirname, "../public/");
// use to change the views directory with custom name
const viewsPath = path.join(__dirname, "../templates/views");
// partials path
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
// set the environmental port for heroku
const port = process.env.PORT || 3000;

// Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
// configure partial by giving its path
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectory));

app.get("", (req, res) => {
  res.render("index", {
    title: "Hello there..",
    name: "Akshit",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Akshit",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Akshit",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide the location.",
    });
  }
  geocode(
    req.query.address,
    (error, { lattitude, longitude, location } = {}) => {
      if (error) {
        return res.render("404page", {
          title: "Error",
          msg: error,
        });
      }

      forecast(lattitude, longitude, (e, { w_description, current, feels }) => {
        if (error) {
          return res.render("404page", {
            title: "Error",
            msg: e,
          });
        }
        res.send({
          forecast:
            w_description +
            ": Current temperature is " +
            current +
            ". It feels like " +
            feels,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // res.render("weather", {
  //   title: "Weather",
  //   name: "Akshit",
  // });
});

app.get("*", (req, res) => {
  res.render("404page", {
    title: "404 Page Not Found",
    msg: "Your requested URl not found",
  });
});

//

// app.get("/weather", (req, res) => {
//   res.send("Weather");
// });

app.listen(port, () => {
  console.log("====================================");
  console.log("Server is up on port " + port);
  console.log("====================================");
});
