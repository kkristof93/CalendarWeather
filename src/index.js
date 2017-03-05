var express = require('express');
var WeatherService = require('./weather-service');
var calendar = require('./calendar');

var app = express();
var config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST,
  apiKey: process.env.DARKSKY_API_KEY
};

var weatherService = new WeatherService(config.apiKey);

app.get('/', function (req, res) {
  weatherService.getForecast(47.498, 19.039, 'hu')
    .then(function (forecasts) {
      var cal = calendar.generate(forecasts);

      res.set({
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="forecast.ics"'
      });
      res.send(cal);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

app.listen(config.port, config.host, function () {
  console.log('CalendarWeather service started');
});
