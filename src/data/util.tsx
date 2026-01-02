import {ChartDataItem, WeatherData} from "@/data/types";
import {MeasurementType} from "@/data/constants";

export const roundToOneDecimalPlace = (num: number) => {
    return Math.round(num * 10) / 10;
}

export const roundToTwoDecimalPlaces = (num: number) => {
    return Math.round(num * 100) / 100;
}

const _getValueByDataType = (dataItem: WeatherData, dataType: MeasurementType) => {
    switch (dataType) {
        case MeasurementType.TEMPERATURE:
            return dataItem.temperature;
        case MeasurementType.PRESSURE:
            return dataItem.pressure;
        case MeasurementType.HUMIDITY:
            return dataItem.humidity;
        case MeasurementType.DEWPOINT:
            return dataItem.dewpoint;
        default:
            return null;
    }
}

export const mapWeatherDataToChartData = (original: WeatherData[] | null | undefined, dataType: MeasurementType): ChartDataItem[] => {
    return original?.map(item => {
        return {
            timestamp: item.timestamp,
            value: _getValueByDataType(item, dataType)
        }
    }) || [];
}

export const getMaxWithTimestamp = (data: ChartDataItem[] | undefined): ChartDataItem => {
    const flattenedData: ChartDataItem[] = data?.flatMap(item => {
        // If the item is null or undefined, return an empty array to skip it
        if (item.value == null) { // Using == null checks for both null and undefined
            return [];
        }
        // Otherwise, return a new array with the transformed item
        return [item];
    }) || [];

    if (flattenedData.length === 0) {
        // Data array was null or empty, or data array had all null values - reduce will fail in this case
        return {
            timestamp: NaN,
            value: NaN,
        };
    }

    return flattenedData.reduce((max, item) => {
        if (item.value == null || max.value == null) {
            throw Error(`Flattened data has null or undefined values. This should never happen.`);
        }

        return item.value > max.value ? item : max;
    });
}

export const getMinWithTimestamp = (data: ChartDataItem[] | undefined): ChartDataItem => {
    const flattenedData: ChartDataItem[] = data?.flatMap(item => {
        // If the item is null or undefined, return an empty array to skip it
        if (item.value == null) { // Using == null checks for both null and undefined
            return [];
        }
        // Otherwise, return a new array with the transformed item
        return [item];
    }) || [];


    if (flattenedData.length === 0) {
        // Data array was null or empty, or data array had all null values - reduce will fail in this case
        return {
            timestamp: NaN,
            value: NaN,
        };
    }

    return flattenedData.reduce((min, item) => {
        if (item.value == null || min.value == null) {
            throw Error(`Flattened data has null or undefined values. This should never happen.`);
        }

        return item.value < min.value ? item : min;
    });
}

export const getAverage = (data: ChartDataItem[] | undefined): number => {
    const flattenedData: number[] = data?.flatMap(item => {
        // If the item is null or undefined, return an empty array to skip it
        if (item.value == null) { // Using == null checks for both null and undefined
            return [];
        }
        // Otherwise, return a new array with the transformed item
        return [item.value];
    }) || [];

    if (flattenedData.length === 0) {
        // Data array was null or empty, or data array had all null values - reduce will fail in this case
        return NaN
    }

    return roundToTwoDecimalPlaces(flattenedData.reduce((s, v) => s + v, 0) / flattenedData.length);
}

type FormatPreset = '24hTime' | 'dayMonth' | 'dayMonth24hTime' | 'full';

/**
 * Universal Epoch Formatter
 * @param epochTimestamp - Unix timestamp in seconds
 * @param preset - '24h' for hh:mm or 'full' for DD MMM yyyy hh:mm AM/PM
 * @param timeZone - The timezone to convert to
 * @param locale - The locale to convert to
 * @param overrides - Optional Intl.DateTimeFormatOptions to customize further
 */
export const formatEpoch = (
    epochTimestamp: number | string | undefined | null,
    preset: FormatPreset = 'full',
    timeZone: string = 'America/New_York',
    locale: string = 'en-US',
    overrides: Intl.DateTimeFormatOptions = {}
): string => {
    if (!epochTimestamp) return '--';
    if (typeof epochTimestamp === 'string') epochTimestamp = parseInt(epochTimestamp);

    const date = new Date(epochTimestamp * 1000);

    // 1. Define Base Presets
    const presets: Record<FormatPreset, Intl.DateTimeFormatOptions> = {
        '24hTime': {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        'full': {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        'dayMonth': {
            day: '2-digit',
            month: 'short',
        },
        'dayMonth24hTime': {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    };

    // 2. Merge preset with timezone and any manual overrides
    const options: Intl.DateTimeFormatOptions = {
        ...presets[preset],
        timeZone,
        ...overrides
    };

    const formatter = new Intl.DateTimeFormat(locale, options);

    // 3. Handle the "Full" format's specific AM/PM capitalization if needed
    if (preset === 'full') {
        const parts = formatter.formatToParts(date);
        const map = new Map(parts.map(p => [p.type, p.value]));

        const dayPeriod = map.get('dayPeriod')?.toUpperCase() || '';
        return `${map.get('day')} ${map.get('month')} ${map.get('year')} ${map.get('hour')}:${map.get('minute')} ${dayPeriod}`.trim();
    }

    // Default simple string return (for 24h and others)
    return formatter.format(date);
};

export const formatMonthNumberToMonthName = (monthNumber: number) => {
    return new Date(Date.UTC(2025, monthNumber, 1)).toLocaleString('default', {month: 'long'});
}

/**
 * Rounds a number to the nearest multiple of 5.
 * @param value - The number to round
 * @param direction - 'up' to round toward positive infinity, 'down' to round toward negative infinity
 */
export const roundToFive = (value: number, direction: 'up' | 'down'): number => {
    if (direction === 'up') {
        return Math.ceil(value / 5) * 5;
    } else {
        return Math.floor(value / 5) * 5;
    }
}

