'use client'

import {Card, Container, Grid, GridCol, Group, Switch, Text, Title} from "@mantine/core";
import {
    IconDroplet,
    IconGauge,
    IconMapPin,
    IconTemperature,
    IconTemperatureMinus,
    IconTemperaturePlus,
    IconWorld
} from '@tabler/icons-react';
import {StatCard} from "@/components/StatCard";
import {useEffect, useState} from "react";
import {getStationWeather, StationWeatherResponse} from "@/data/network";
import {formatEpoch, getAverage, getMaxWithTimestamp, getMinWithTimestamp, roundToOneDecimalPlace} from "@/data/util";
import LineChartCard from "@/components/LineChartCard";
import {MeasurementType, UnitSystem} from "@/data/constants";
import {useRouter, useSearchParams} from "next/navigation";
import {applyUnitConversion, getUnit, suffixWithUnit} from "@/data/conversion";
import AnnualStatsTable from "@/components/AnnualStatsTable";


const Home = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const unitSystemParam = searchParams.get('u');
    const unitSystem = unitSystemParam === UnitSystem.METRIC ? UnitSystem.METRIC : UnitSystem.IMPERIAL;
    const pressureUnit = getUnit(MeasurementType.PRESSURE, unitSystem);

    const [stationWeather, setStationWeather] = useState<StationWeatherResponse | undefined>(undefined)

    const getFormattedDateTime = (epochSeconds: number | undefined) => {
        return epochSeconds ? formatEpoch(epochSeconds) : "Unknown";
    }

    useEffect(() => {
        getStationWeather().then(response => {
            if (response) {
                setStationWeather(applyUnitConversion(response, unitSystem))
                console.log(response)
            }
        }).catch(error => {
            console.log(error);
            setStationWeather(undefined);
        });
    }, [unitSystem])

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
                <Grid>
                    <GridCol span="auto">
                        <Title order={4}>Current Weather</Title>
                        <Text size="xs" c="gray" mt={1}>As
                            of {getFormattedDateTime(stationWeather?.data?.current?.timestamp)}</Text>
                    </GridCol>
                    <GridCol span="content">
                        <Switch
                            onChange={(event) => {
                                router.push(`?u=${event.target.checked ? UnitSystem.METRIC : UnitSystem.IMPERIAL}`);
                            }}
                            size="lg"
                            defaultChecked={unitSystem === UnitSystem.METRIC.toString()}
                            onLabel={<IconWorld width={16}/>}
                            offLabel={<IconWorld color="gray" width={16}/>}/>
                    </GridCol>
                </Grid>
                <Grid mt="md">
                    <GridCol span={{base: 12, sm: 4}}>
                        <Group gap="md" align="flex-start">
                            <IconTemperature size={48} color="#ff7979"/>
                            <div>
                                <Text size="sm" c="dimmed">Temperature</Text>
                                <Text
                                    size="2rem">{suffixWithUnit(stationWeather?.data?.current?.temperature, MeasurementType.TEMPERATURE, unitSystem)}</Text>
                                <Text size="xs" c="dimmed" mt="xs">
                                    Dew
                                    Point: {suffixWithUnit(stationWeather?.data?.current?.dewpoint, MeasurementType.TEMPERATURE, unitSystem)}
                                </Text>
                            </div>
                        </Group>
                    </GridCol>
                    <GridCol span={{base: 12, sm: 4}}>
                        <Group gap="md" align="flex-start">
                            <IconDroplet size={48} color="#22a6b3"/>
                            <div>
                                <Text size="sm" c="dimmed">Humidity</Text>
                                <Text
                                    size="2rem">{suffixWithUnit(stationWeather?.data?.current?.humidity, MeasurementType.HUMIDITY, unitSystem)}</Text>
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
                                <Text size="2rem">{stationWeather?.data?.current?.pressure}</Text>
                                <Text size="xs" c="dimmed" mt="xs">
                                    {pressureUnit}
                                </Text>
                            </div>
                        </Group>
                    </GridCol>
                </Grid>
            </Card>

            <Grid mt="lg">
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Max Temperature"
                              value={`${suffixWithUnit(getMaxWithTimestamp(stationWeather?.data?.past_24h?.temperature)?.value, MeasurementType.TEMPERATURE, unitSystem)}`}
                              icon={<IconTemperaturePlus size={24}/>} color="#ff7979"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Min Temperature"
                              value={`${suffixWithUnit(getMinWithTimestamp(stationWeather?.data?.past_24h?.temperature)?.value, MeasurementType.TEMPERATURE, unitSystem)}`}
                              icon={<IconTemperatureMinus size={24}/>} color="lightblue"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Average Humidity"
                              value={`${suffixWithUnit(roundToOneDecimalPlace(getAverage(stationWeather?.data?.past_24h?.humidity)!), MeasurementType.HUMIDITY, unitSystem)}`}
                              icon={<IconDroplet size={24}/>} color="#22a6b3"/>
                </GridCol>
                <GridCol span={{base: 6, sm: 3}}>
                    <StatCard title="24h Average Pressure"
                              value={`${getAverage(stationWeather?.data?.past_24h?.pressure)} ${pressureUnit}`}
                              icon={<IconGauge size={24}/>} color="#badc58"/>
                </GridCol>
            </Grid>

            <LineChartCard data={stationWeather?.data?.past_24h?.temperature}
                           dataType={MeasurementType.TEMPERATURE}
                           lineColor="red"
                           unitSystem={unitSystem}
                           chartTitle="Temperature Past 24 hours"/>

            <LineChartCard data={stationWeather?.data?.past_24h?.humidity}
                           dataType={MeasurementType.HUMIDITY}
                           lineColor="cyan"
                           unitSystem={unitSystem}
                           chartTitle="Relative Humidity Past 24 Hours"/>

            <LineChartCard data={stationWeather?.data?.past_24h?.pressure}
                           dataType={MeasurementType.PRESSURE}
                           lineColor="teal"
                           unitSystem={unitSystem}
                           chartTitle="Station Level Pressure Past 24 Hours"/>

            <AnnualStatsTable data={stationWeather?.data?.annual_temperatures}
                              unitSystem={unitSystem}
                              title={"Annual Temperatures"}/>

        </Container>
    );
}

export default Home;
