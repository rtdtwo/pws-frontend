import {StationWeatherResponse} from "@/data/types";

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