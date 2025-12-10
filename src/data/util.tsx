import {PastWeatherData} from "@/data/network";

export const roundToOneDecimalPlace = (num: number) => {
    return Math.round(num * 10) / 10;
}

export const roundToTwoDecimalPlaces = (num: number) => {
    return Math.round(num * 100) / 100;
}

export const getMaxWithTimestamp = (data: PastWeatherData[] | undefined) => {
    if (!Array.isArray(data) || data.length === 0) {
        return null; // or { value: null, timestamp: null }
    }

    return data.reduce((max, item) => {
        return item.value > max.value ? item : max;
    });
}

export const getMinWithTimestamp = (data: PastWeatherData[] | undefined) => {
    if (!Array.isArray(data) || data.length === 0) {
        return null; // or { value: null, timestamp: null }
    }

    return data.reduce((min, item) => {
        return item.value < min.value ? item : min;
    });
}

export const getAverage = (data: PastWeatherData[] | undefined) => {
    if (!Array.isArray(data) || data.length === 0) {
        return null; // or { value: null, timestamp: null }
    }

    return roundToTwoDecimalPlaces(
        data.map(data => data.value).reduce((s, v) => s + v, 0) / data.length
    );
}

export const formatEpochToTimezone = (epochTimestamp: number, timeZone: string, locale = 'en-US') => {
    const date = new Date(epochTimestamp * 1000);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format (hh:mm)
        timeZone: timeZone
    };

    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
}

export const formatMonthNumberToMonthName = (monthNumber: number) => {
    return new Date(Date.UTC(2025, monthNumber, 1)).toLocaleString('default', {month: 'long'});
}

