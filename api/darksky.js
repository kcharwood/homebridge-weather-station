"use strict";

const DarkSky = require('dark-sky'),
    converter = require('../util/converter'),
    moment = require('moment-timezone'),

    reportCharacteristics = [
        'AirPressure',
        'CloudCover',
        'Condition',
        'ConditionCategory',
        'DewPoint',
        'Humidity',
        'ObservationTime',
        'Ozone',
        'Rain1h',
        'RainDay',
        'Temperature',
        'UVIndex',
        'Visibility',
        'WindDirection',
        'WindSpeed',
        'WindSpeedMax'],

    forecastCharacteristics = [
        'AirPressure',
        'CloudCover',
        'Condition',
        'ConditionCategory',
        'DewPoint',
        'ForecastDay',
        'Humidity',
        'Ozone',
        'RainChance',
        'RainDay',
        'Temperature',
        'TemperatureMin',
        'UVIndex',
        'Visibility',
        'WindDirection',
        'WindSpeed',
        'WindSpeedMax'];

var debug;

var init = function (apiKey, language, units, location, d) {
    this.darksky = new DarkSky(apiKey);
    this.darksky.options({
        latitude: location[0],
        longitude: location[1],
        language: language,
        units: units,
        exclude: ['minutely', 'hourly', 'alerts', 'flags']
    });
    debug = d;
};

var update = function (callback) {
    debug("Updating weather with dark sky");

    let weather = {};
    weather.forecasts = [];

    this.darksky.get()
        .then(function (response) {
            // Current weather report
            weather.report = parseReport(response['currently'], response['timezone']);

            // Forecasts for today and next 3 days
            weather.forecasts.push(parseForecast(response['daily']['data'][0]));
            weather.forecasts.push(parseForecast(response['daily']['data'][1]));
            weather.forecasts.push(parseForecast(response['daily']['data'][2]));
            weather.forecasts.push(parseForecast(response['daily']['data'][3]));
            weather.forecasts.push(parseForecast(response['daily']['data'][4]));
            weather.forecasts.push(parseForecast(response['daily']['data'][5]));
            weather.forecasts.push(parseForecast(response['daily']['data'][6]));
            callback(null, weather);
        })
        .catch(function (error) {
            debug("Error retrieving weather from dark sky");
            debug("Error Message: " + error);
            callback(error);
        });
};

var parseReport = function (values, timezone) {
    let report = {};

    report.AirPressure = parseInt(values['pressure']);
    report.CloudCover = parseInt(values['cloudCover'] * 100);
    report.Condition = values['summary'];
    report.ConditionCategory = converter.getConditionCategory(values['icon']);
    report.DewPoint = parseInt(values['dewPoint']);
    report.Humidity = parseInt(values['humidity'] * 100);
    report.ObservationTime = moment.unix(values['time']).tz(timezone).format('HH:mm:ss');
    report.Ozone = parseInt(values['ozone']);
    // TODO Check
    report.Rain1h = isNaN(parseInt(values['precipIntensity'])) ? 0 : parseInt(values['precipIntensity']);
    // TODO Replace with time machine accumulated precip
    report.RainDay = isNaN(parseInt(values['precipIntensity'])) ? 0 : parseInt(values['precipIntensity']);
    report.Temperature = values['temperature'];
    report.UVIndex = isNaN(parseInt(values['uvIndex'])) ? 0 : parseInt(values['uvIndex']);
    report.Visibility = isNaN(parseInt(values['visibility'])) ? 0 : parseInt(values['visibility']);
    report.WindDirection = converter.getWindDirection(values['windBearing']);
    report.WindSpeed = parseFloat(values['windSpeed']);
    report.WindSpeedMax = parseFloat(values['windGust']);

    return report;
}

var parseForecast = function (values) {
    let forecast = {};

    forecast.AirPressure = parseInt(values['pressure']);
    forecast.CloudCover = parseInt(values['cloudCover'] * 100);
    forecast.Condition = values['summary'];
    forecast.ConditionCategory = converter.getConditionCategory(values['icon']);
    forecast.DewPoint = parseInt(values['dewPoint']);
    // TODO
    forecast.ForecastDay = 'blub';
    forecast.Humidity = parseInt(values['humidity'] * 100);
    forecast.Ozone = parseInt(values['ozone']);
    forecast.RainChance = parseInt(values['precipProbability'] * 100);
    // TODO Replace with time machine accumulated precip
    forecast.RainDay = isNaN(parseInt(values['precipIntensity'])) ? 0 : parseInt(values['precipIntensity']);
    forecast.Temperature = values['temperatureHigh'];
    forecast.TemperatureMin = values['temperatureLow'];
    forecast.UVIndex = isNaN(parseInt(values['uvIndex'])) ? 0 : parseInt(values['uvIndex']);
    forecast.Visibility = isNaN(parseInt(values['visibility'])) ? 0 : parseInt(values['visibility']);
    forecast.WindDirection = converter.getWindDirection(values['windBearing']);
    forecast.WindSpeed = parseFloat(values['windSpeed']);
    forecast.WindSpeedMax = parseFloat(values['windGust']);

    return forecast;
};

module.exports = {
    init,
    update,
    reportCharacteristics,
    forecastCharacteristics
};