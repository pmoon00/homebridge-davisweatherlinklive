class DavisWeatherLinkLive {
	constructor(arg1, arg2) {

	}
}

DavisWeatherLinkLive.prototype = {
    httpRequest: function (url, body, method, callback) {
        request({
			url: url,
			body: body,
			method: method
		},
		function (error, response, body) {
			callback(error, response, body)
		})
    },

    getStateHumidity: function (callback) {
        callback(null, this._cachedData.humidity);
    },

    getStateTemperature: function (callback) {
        callback(null, this._cachedData.temperature);
    },

    getServices: function () {
        var services = [],
            informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);
        services.push(informationService);

		this.temperatureService = new Service.TemperatureSensor(this.name);
        this.temperatureService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .on("get", this.getStateTemperature.bind(this));
        services.push(this.temperatureService);

		this.humidityService = new Service.HumiditySensor(this.name);
		this.humidityService
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
			.setProps({minValue: 0, maxValue: 100})
			.on("get", this.getStateHumidity.bind(this));
		services.push(this.humidityService);

        return services;
	},

	getData: function (url) {
		this.httpRequest(url, "", "GET", function (error, response, responseBody) {
			var queue = function () {
				if (this._timeoutID > -1) {
					clearTimeout(this._timeoutID);
					this._timeoutID = -1;
				}
	
				this._timeoutID = setTimeout(function () {
					this._timeoutID = -1;
					this.getData(this.url);
				}.bind(this), this.pollingIntervalSeconds * 1000);
			}.bind(this);

            if (error) {
				this.log("Request to Davis API failed: %s", error.message);
				queue();
                return;
			}
			
			this.log("Request to Davis API succeeded: %s", responseBody);

			var jsonResponse = JSON.parse(responseBody);
			
			if (jsonResponse.data && (!jsonResponse.data.conditions || jsonResponse.data.conditions.length == 0)) {
				this.log("Response from Davis API doesn't contain expected result.");
				queue();
				return;
			}

			var weatherResponse = jsonResponse.data.conditions[0];

			this._cachedData = {
				"temperature": this.temperatureUnitOfMeasure == "C" ? this.convertFromFahrenheitToCelsius(weatherResponse.temp) : weatherResponse.temp,
				"humidity": Math.round(weatherResponse.hum)
			};
			this.log("Successfully got data.  Temp %s, hum %s", this._cachedData.temperature, this._cachedData.humidity);

			queue();
        }.bind(this));
	},

	convertFromFahrenheitToCelsius: function (f) { //MUST BE A NUMBER!
        return parseFloat(((f - 32) * (5 / 9)).toFixed(1));
    }
};