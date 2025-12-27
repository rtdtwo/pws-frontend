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

