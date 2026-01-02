import {MeasurementType} from "@/data/constants";

export const getColorForMeasurementType = (type: MeasurementType) => {
    switch (type) {
        case MeasurementType.HUMIDITY:
            return "DodgerBlue"
        case MeasurementType.TEMPERATURE:
            return "Crimson"
        case MeasurementType.PRESSURE:
            return "DarkCyan"
        case MeasurementType.DEWPOINT:
            return "LightPink"
    }
}