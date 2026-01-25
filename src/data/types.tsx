export type ChartDataItem = {
    timestamp: number,
    value: number | null
}

export type WeatherData = {
    timestamp: number,
    temperature: number,
    humidity: number,
    dewpoint: number,
    pressure: number
}

export type AnnualWeatherData = {
    monthIndex: number,
    temperature: {
        max: number,
        maxTimestamp: number,
        min: number,
        minTimestamp: number,
        avg: number
    }
}

export type StationWeatherResponse = {
    code: number,
    data: {
        current: WeatherData,
        past_24h: WeatherData[],
        annual_temperatures: AnnualWeatherData[]
    }
}