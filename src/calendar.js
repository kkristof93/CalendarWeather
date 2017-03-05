var _ = require('lodash');
var ical = require('ical-generator');

function generate(forecasts) {
  return ical({
    name: 'Weather Forecast',
    events: _.map(forecasts, createEvent)
  }).toString();
}

function createEvent(forecast) {
  return {
    start: forecast.time,
    allDay: true,
    summary: emojiIcon(forecast.icon) + ' ' + forecast.temperatureMax + ' °C',
    description: forecast.summary,
  };
}

function emojiIcon(icon) {
  var emojis = {
    'clear-day': '🌞',
    'clear-night': '🌚',
    'rain': '☔️',
    'snow': '⛄️',
    'sleet': '☔️❄️',
    'wind': '💨',
    'fog': '🌁',
    'cloudy': '☁️',
    'partly-cloudy-day': '⛅️',
    'partly-cloudy-night': '🌚☁️'
  };
  return emojis[icon] ? emojis[icon] : '❓';
}

module.exports = {
  generate: generate
};
