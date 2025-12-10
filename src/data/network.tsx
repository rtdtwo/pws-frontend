type CurrentWeatherData = {
    timestamp: number,
    temperature: number,
    humidity: number,
    pressure: number
}

export type PastWeatherData = {
    timestamp: number,
    value: number
}

export type AnnualWeatherData = {
    month_index: number,
    max: number,
    min: number,
}

export type StationWeatherResponse = {
    code: number,
    data: {
        current: CurrentWeatherData,
        past_24h: {
            temperature: PastWeatherData[],
            humidity: PastWeatherData[],
            pressure: PastWeatherData[]
        },
        annual_temperatures: AnnualWeatherData[]
    }
}

export const getStationWeather = async (): Promise<StationWeatherResponse | null> => {
    const uri = `${process.env.NEXT_PUBLIC_GET_WEATHER_ROUTE}`;
    try {
        const response = await fetch(uri);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to get station weather data");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}