type CurrentWeatherData = {
    timestamp: number,
    temperature: number,
    humidity: number
}

export type PastWeatherData = {
    timestamp: number,
    value: number
}

export type StationWeatherResponse = {
    code: number,
    data: {
        current: CurrentWeatherData,
        past_24h: {
            temperature: PastWeatherData[],
            humidity: PastWeatherData[]
        }
    }
}

export const getStationWeather = async (): Promise<StationWeatherResponse | null> => {
    const uri = "https://pws-backend-1-pgh9y.ondigitalocean.app/api/station/45b83af1-4a0f-46a2-910d-1dd3ccc1031c/weather";
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