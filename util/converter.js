"use strict";

const debug = require('debug')('homebridge-weather-plus');

var getConditionCategory = function (name) {
	switch (name) {
		case "snow":
		case "sleet":
		case "flurries":
		case "chancesnow":
		case "chancesleet":
		case "chanceflurries":
		case "hail":
			return 3;
		case "rain":
		case "tstorms":
		case "chancerain":
		case "chancetstorms":
		case "thunderstorm":
		case "tornado":
			return 2;
		case "cloudy":
		case "mostlycloudy":
		case "partlysunny":
		case "fog":
		case "hazy":
		case "wind":
			return 1;
		case "partlycloudy":
		case "mostlysunny":
		case "sunny":
		case "clear":
		case "clear-day":
		case "clear-night":
		case "partly-cloudy-day":
		case "partly-cloudy-night":
		default:
			return 0;
	}
};

var getWindDirection = function (degree) {
	if (typeof degree !== 'number' || isNaN(degree)) {
		return 'Unkown';
	}
	let cat = Math.round(degree % 360 / 22.5);
	let dir;

	// TODO multilanguage
	switch (cat) {
		case 0:
			dir = 'N';
			break;
		case 1:
			dir = 'NNE';
			break;
		case 2:
			dir = 'NE';
			break;
		case 3:
			dir = 'ENE';
			break;
		case 4:
			dir = 'E';
			break;
		case 5:
			dir = 'ESE';
			break;
		case 6:
			dir = 'SE';
			break;
		case 7:
			dir = 'SSE';
			break;
		case 8:
			dir = 'S';
			break;
		case 9:
			dir = 'SSW';
			break;
		case 10:
			dir = 'SW';
			break;
		case 11:
			dir = 'WSW';
			break;
		case 12:
			dir = 'W';
			break;
		case 13:
			dir = 'WNW';
			break;
		case 14:
			dir = 'NW';
			break;
		case 15:
			dir = 'NNW';
			break;
		case 16:
			dir = 'N';
			break;
		default:
			dir = 'Variable';
	}
	debug("Converted wind direction from " + degree + " degress to direction " + dir);
	return dir;
};

var getRainAccumulated = function (array, parameter) {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += array[i][parameter];
	}
	return sum;
};

module.exports = {
	getConditionCategory,
	getWindDirection,
	getRainAccumulated
};