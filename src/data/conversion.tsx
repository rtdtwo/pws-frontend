import {MeasurementType, UnitSystem} from "@/data/constants";
import {roundToOneDecimalPlace, roundToTwoDecimalPlaces} from "@/data/util";
import {StationWeatherResponse} from "@/data/types";


const convertCelsiusToFahrenheit = (temperature: number) => {
    return roundToOneDecimalPlace((temperature * 9 / 5) + 32);
}

const convertMbarToInHg = (pressure: number) => {
    return roundToTwoDecimalPlaces(pressure / 33.864);
}

export const getUnit = (measurementType: MeasurementType, unitSystem: UnitSystem): string => {
    if (measurementType == MeasurementType.HUMIDITY) return "%";

    if (unitSystem === UnitSystem.METRIC) {
        switch (measurementType) {
            case MeasurementType.TEMPERATURE:
                return "°C"
            case MeasurementType.PRESSURE:
                return "mbar"
        }
    }

    if (unitSystem === UnitSystem.IMPERIAL) {
        switch (measurementType) {
            case MeasurementType.TEMPERATURE:
                return "°F"
            case MeasurementType.PRESSURE:
                return "inHg"
        }
    }

    return "";
}

export const applyUnitConversion = (response: StationWeatherResponse | undefined, unitSystem: UnitSystem) => {
    if (!response) {
        return undefined;
    }

    const newResponse: StationWeatherResponse = {...response};

    if (unitSystem === UnitSystem.METRIC) {
        newResponse.data.current.temperature = roundToOneDecimalPlace(response.data.current.temperature);
        newResponse.data.current.dewpoint = roundToOneDecimalPlace(response.data.current.dewpoint);
        newResponse.data.current.pressure = roundToTwoDecimalPlaces(response.data.current.pressure);
        newResponse.data.past_24h.forEach(item => {
            item.temperature = roundToOneDecimalPlace(item.temperature)
            item.pressure = roundToOneDecimalPlace(item.pressure)
            item.dewpoint = roundToOneDecimalPlace(item.dewpoint)
        });
        newResponse.data.annual_temperatures.forEach(item => {
            item.temperature.min = roundToOneDecimalPlace(item.temperature.min);
            item.temperature.max = roundToOneDecimalPlace(item.temperature.max);
            item.temperature.avg = roundToOneDecimalPlace(item.temperature.avg);
        });
    } else {
        newResponse.data.current.temperature = convertCelsiusToFahrenheit(response.data.current.temperature);
        newResponse.data.current.dewpoint = convertCelsiusToFahrenheit(response.data.current.dewpoint);
        newResponse.data.current.pressure = convertMbarToInHg(response.data.current.pressure);
        newResponse.data.past_24h.forEach(item => {
            item.temperature = convertCelsiusToFahrenheit(item.temperature)
            item.pressure = convertMbarToInHg(item.pressure)
            item.dewpoint = convertCelsiusToFahrenheit(item.dewpoint)
        });
        newResponse.data.annual_temperatures.forEach(item => {
            item.temperature.min = convertCelsiusToFahrenheit(item.temperature.min);
            item.temperature.max = convertCelsiusToFahrenheit(item.temperature.max);
            item.temperature.avg = convertCelsiusToFahrenheit(item.temperature.avg);
        });
    }

    return newResponse;
}

export const suffixWithUnit = (value: number | string | undefined | null, measurementType: MeasurementType, unitSystem: UnitSystem) => {
    if (value !== null && value !== undefined) {
        return `${value}${getUnit(measurementType, unitSystem)}`;
    } else {
        return "--";
    }
}

export const convertTemperature = (temperature: number, targetUnitSystem: UnitSystem) => {
    return targetUnitSystem === UnitSystem.METRIC ? temperature : convertCelsiusToFahrenheit(temperature);
}