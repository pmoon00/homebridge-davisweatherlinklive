# Homebridge Davis WeatherLink Live

This is a Homebridge plugin that allows you to integrate your Davis WeatherLink Live station API.

## Installation

You must have Homebridge already installed, then just install the plugin by running `npm install -g homebridge-davisweatherlinklive`

## How It Works

This will call your Davis WeatherLink Live station API.  The endpoint it is designed for is /v1/current_conditions.  It will look at the following JSON path for temperature and humidity.

* Temperature - `data.conditions[0].temp`
* Humidity - `data.conditions[0].hum`

The API will be called once at start up and polled periodically.  The results will be stored in memory, to prevent slowness when opening the Home app.

## Configuration

I have included an example config of the accessory in `example.config.json`.

### Required Accessory Options

* `url` - The URL for the Davis WeatherLink Live station API.  e.g. http://10.0.0.100/v1/current_conditions
* `name` - Friendly name for the sensor
* `manufacturer` - Manufacturer
* `model` - Model

### Optional Accessory Option

* `pollingIntervalSeconds` - Set this to the seconds value you want to periodically poll your Davis WeatherLink Live station API.  DEFAULT: 300
* `temperatureUnitOfMeasure` - Choose "C" or "F".  DEFAULT: C