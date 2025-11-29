'use client'

import {Card, Container, Grid, GridCol, Group, Text, Title} from "@mantine/core";
import {
    IconDroplet,
    IconGauge,
    IconMapPin,
    IconTemperature,
    IconTemperatureMinus,
    IconTemperaturePlus
} from '@tabler/icons-react';
import {StatCard} from "@/components/StatCard";
import {useEffect, useState} from "react";
import {getStationWeather, StationWeatherResponse} from "@/data/network";
import {getAverage, getMaxWithTimestamp, getMinWithTimestamp} from "@/data/util";
import ChartCard from "@/components/ChartCard";


const Home = () => {


    const getFormattedDateTime = (epochSeconds: number | undefined) => {
        if (epochSeconds) {
            const date = new Date(epochSeconds * 1000);
            return date.toLocaleString('en-US', {timeZone: 'America/New_York'});
        }

        return "Unknown";
    }

    const [stationWeather, setStationWeather] = useState<StationWeatherResponse | undefined>(undefined)

    useEffect(() => {
        getStationWeather().then(response => {
            if (response) {
                setStationWeather(response)
                console.log(response)
            }
        }).catch(error => {
            console.log(error);
            setStationWeather(undefined);
        });

    }, [])

    return (
        <Container size="md" p="lg">
            <Title order={2}>Rishabh&#39;s Personal Weather Station</Title>
            <Group gap="xs">
                <IconMapPin size={16}/>
                <Text size="md" pt={1}>
                    Cambridge Highlands, Cambridge, MA
                </Text>
            </Group>

            <Card shadow="sm" pt="sm" radius="md" mt="lg">
                <Title order={4}>Current Weather</Title>
                <Text size="xs" c="gray" mt={1}>As
                    of {getFormattedDateTime(stationWeather?.data?.current?.timestamp)}</Text>
                <Grid mt="md">
                    <GridCol span={{base: 12, sm: 4}}>
                        <Group gap="md" align="flex-start">
                            <IconTemperature size={48} color="#ff7979"/>
                            <div>
                                <Text size="sm" c="dimmed">Temperature</Text>
                                <Text size="2rem">{stationWeather?.data?.current?.temperature}°C</Text>
                                <Text size="xs" c="dimmed" mt="xs">
                                    Feels like: N/A
                                </Text>
                            </div>
                        </Group>
                    </GridCol>
                    <GridCol span={{base: 12, sm: 4}}>
                        <Group gap="md" align="flex-start">
                            <IconDroplet size={48} color="#22a6b3"/>
                            <div>
                                <Text size="sm" c="dimmed">Humidity</Text>
                                <Text size="2rem">{stationWeather?.data?.current?.humidity}%</Text>
                                <Text size="xs" c="dimmed" mt="xs">
                                    Relative
                                </Text>
                            </div>
                        </Group>
                    </GridCol>
                    <GridCol span={{base: 12, sm: 4}}>
                        <Group gap="md" align="flex-start">
                            <IconGauge size={48} color="#badc58"/>
                            <div>
                                <Text size="sm" c="dimmed">Pressure</Text>
                                <Text size="2rem">--</Text>
                                <Text size="xs" c="dimmed" mt="xs">
                                    mbar
                                </Text>
                            </div>
                        </Group>
                    </GridCol>
                </Grid>
            </Card>

            <Grid mt="lg">
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Max Temperature"
                              value={`${getMaxWithTimestamp(stationWeather?.data?.past_24h?.temperature)?.value}°C`}
                              icon={<IconTemperaturePlus size={24}/>} color="#ff7979"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Min Temperature"
                              value={`${getMinWithTimestamp(stationWeather?.data?.past_24h?.temperature)?.value}°C`}
                              icon={<IconTemperatureMinus size={24}/>} color="lightblue"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Average Humidity"
                              value={`${getAverage(stationWeather?.data?.past_24h?.humidity)}%`}
                              icon={<IconDroplet size={24}/>} color="#22a6b3"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Average Pressure"
                              value={`--`}
                              icon={<IconGauge size={24}/>} color="#badc58"/>
                </GridCol>
            </Grid>

            <ChartCard data={stationWeather?.data?.past_24h?.temperature} dataType="temperature" lineColor="red"
                       chartTitle="Temperature (°C)"/>
            <ChartCard data={stationWeather?.data?.past_24h?.humidity} dataType="humidity" lineColor="cyan"
                       chartTitle="Relative Humidity (%)"/>

        </Container>
    );
}

export default Home;
