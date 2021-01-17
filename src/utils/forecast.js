const request = require("postman-request");

const forecast = (lattitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=17750406563dc8dae3a6cb820e97d281&query=" +
    lattitude +
    "," +
    longitude;
  ("&units=f");
  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (response.body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, {
        w_description: response.body.current.weather_descriptions[0],

        current: response.body.current.temperature,

        feels: response.body.current.feelslike,
      });
    }
  });
};

module.exports = forecast;
