import {MeasurementType, UnitSystem} from "@/data/constants";
import {StationWeatherResponse} from "@/data/network";

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

    if (unitSystem === UnitSystem.METRIC) {
        return response;
    }

    const newResponse: StationWeatherResponse = {...response};
    newResponse.data.current.temperature = Math.round((response.data.current.temperature * 9 / 5) + 32);
    newResponse.data.past_24h.temperature.forEach(item => item.value = Math.round((item.value * 9 / 5) + 32));
    return newResponse;
}

export const suffixWithUnit = (value: number | string | undefined | null, measurementType: MeasurementType, unitSystem: UnitSystem) => (
    value ? `${value}${getUnit(measurementType, unitSystem)}` : "--"
)