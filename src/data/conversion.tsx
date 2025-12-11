import {MeasurementType, UnitSystem} from "@/data/constants";
import {StationWeatherResponse} from "@/data/network";
import {roundToOneDecimalPlace, roundToTwoDecimalPlaces} from "@/data/util";


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
        newResponse.data.past_24h.temperature.forEach(item => item.value = roundToOneDecimalPlace(item.value));
        newResponse.data.past_24h.pressure.forEach(item => item.value = roundToTwoDecimalPlaces(item.value));
        newResponse.data.annual_temperatures.forEach(item => {
            item.min = roundToOneDecimalPlace(item.min);
            item.max = roundToOneDecimalPlace(item.max);
        });
    } else {
        newResponse.data.current.temperature = convertCelsiusToFahrenheit(response.data.current.temperature);
        newResponse.data.current.dewpoint = convertCelsiusToFahrenheit(response.data.current.dewpoint);
        newResponse.data.current.pressure = convertMbarToInHg(response.data.current.pressure);
        newResponse.data.past_24h.temperature.forEach(item => item.value = convertCelsiusToFahrenheit(item.value));
        newResponse.data.past_24h.pressure.forEach(item => item.value = convertMbarToInHg(item.value));
        newResponse.data.annual_temperatures.forEach(item => {
            item.min = convertCelsiusToFahrenheit(item.min);
            item.max = convertCelsiusToFahrenheit(item.max);
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