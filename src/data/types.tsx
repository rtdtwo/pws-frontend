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
    month_index: number,
    max: number,
    min: number,
}

export type StationWeatherResponse = {
    code: number,
    data: {
        current: WeatherData,
        past_24h: WeatherData[],
        annual_temperatures: AnnualWeatherData[]
    }
}