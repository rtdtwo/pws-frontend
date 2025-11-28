import {PastWeatherData} from "@/data/network";

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

    return Math.round(
        data.map(data => data.value).reduce((s, v) => s + v, 0) / data.length
    );
}