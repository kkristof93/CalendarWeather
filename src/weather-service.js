var _ = require('lodash');
var Promise = require('bluebird');
var request = require("request");

var baseUrl = 'https://api.darksky.net/forecast/';

function WeatherService(apiKey) {
  this.apiKey = apiKey;
}

WeatherService.prototype.getForecast = function (latitude, longitude, language) {
  return loadForecast(this.apiKey, latitude, longitude, language)
    .then(processData);
};

function loadForecast (apiKey, latitude, longitude, language) {
  return new Promise(function (resolve, reject) {
    var url = baseUrl + apiKey + '/' + latitude.toString() + ',' + longitude.toString() + '?exclude=currently,minutely,hourly,alerts,flags&units=si&lang=' + language;

    request.get(url, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      try {
        var json = JSON.parse(body);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function processData (json) {
  return new Promise(function (resolve, reject) {
    var result = _.map(json.daily.data, function (data) {
      return {
        time: new Date(data.time * 1000),
        summary: data.summary,
        icon: data.icon,
        sunriseTime: new Date(data.sunriseTime * 1000),
        sunsetTime: new Date(data.sunsetTime * 1000),
        temperatureMin: data.temperatureMin,
        temperatureMax: data.temperatureMax,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        windBearing: data.windBearing,
        cloudCover: data.cloudCover,
        pressure: data.pressure
      };
    });
    resolve(result);
  });
}

module.exports = WeatherService;
