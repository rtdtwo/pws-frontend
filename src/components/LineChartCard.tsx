'use client'

import {ChartReferenceLineProps, LineChart, LineChartSeries} from "@mantine/charts";
import {Card, Paper, Text} from "@mantine/core";
import {WeatherData} from "@/data/network";
import {
    formatEpoch,
    getMaxWithTimestamp,
    getMinWithTimestamp,
    mapWeatherDataToChartData,
    roundToFive
} from "@/data/util";
import {MeasurementType, UnitSystem} from "@/data/constants";
import {getUnit} from "@/data/conversion";

type ChartCardProps = {
    data: WeatherData[] | undefined,
    dataType: MeasurementType,
    unitSystem: UnitSystem,
    chartTitle: string,
    yAxisBounds?: [number, number],
}

type ChartPayloadItem = {
    name: string;
    value: number;
    color: string;
}

interface ChartTooltipProps {
    label: React.ReactNode;
    payload: readonly ChartPayloadItem[] | undefined;
    dataType: MeasurementType;
}

const LineChartCard = ({data, dataType, unitSystem, chartTitle, yAxisBounds}: ChartCardProps) => {

    // Sort the data in ascending order
    const sortedData = data ? [...data].sort((a, b) => a.timestamp - b.timestamp) : [];

    const computeYAxisBounds = () => {
        if (sortedData) {
            switch (dataType) {
                case MeasurementType.TEMPERATURE:
                    const tMinValue = getMinWithTimestamp(mapWeatherDataToChartData(sortedData, MeasurementType.DEWPOINT)).value;
                    const tMaxValue = getMaxWithTimestamp(mapWeatherDataToChartData(sortedData, MeasurementType.TEMPERATURE)).value;
                    if (tMinValue == null || tMaxValue == null) return ['dataMin', 'dataMax'];
                    return [roundToFive(tMinValue - 1, 'down'), roundToFive(tMaxValue + 1, 'up')];
                case MeasurementType.PRESSURE:
                    const pressureData = mapWeatherDataToChartData(sortedData, MeasurementType.PRESSURE);
                    const pMinValue = getMinWithTimestamp(pressureData).value;
                    const pMaxValue = getMaxWithTimestamp(pressureData).value;
                    if (pMinValue == null || pMaxValue == null) return ['dataMin', 'dataMax'];
                    if (unitSystem === UnitSystem.METRIC)
                        return [roundToFive(pMinValue - 1, 'down'), roundToFive(pMaxValue + 1, 'up')];
                    else
                        return [pMaxValue - 0.1, pMaxValue + 0.1];
                case MeasurementType.HUMIDITY:
                    return [0, 100]
                default:
                    return ['dataMin', 'dataMax']
            }
        }
    }

    const getSeriesData = (): LineChartSeries[] => {
        switch (dataType) {
            case MeasurementType.TEMPERATURE:
                return [{name: 'temperature', color: 'Crimson'}, {name: 'dewpoint', color: 'LightPink'}]
            case MeasurementType.PRESSURE:
                return [{name: 'pressure', color: 'DarkCyan'}]
            case MeasurementType.HUMIDITY:
                return [{name: 'humidity', color: 'DodgerBlue'}]
        }
        return [];
    }

    const unitStr = getUnit(dataType, unitSystem);

    const ChartTooltip = ({label, payload, dataType}: ChartTooltipProps) => {
        if (!payload) return null;

        return (
            <Paper px="md" py="sm" withBorder shadow="md" radius="md">
                <Text fw={500} mb={5}>{label}</Text>
                {payload.map((item: ChartPayloadItem) => (
                    <Text key={item.name} c={item.color} fz="sm">
                        {`${item.name}: ${item.value}${dataType === MeasurementType.PRESSURE ? ' ' : ''}${unitStr}`}
                    </Text>
                ))}
            </Paper>
        );
    }

    const generateReferenceLines = (): ChartReferenceLineProps[] => {
        if (!sortedData || sortedData.length === 0) return [];

        const referenceLines: ChartReferenceLineProps[] = [];

        // Start of Current Day
        const latestTimestamp = sortedData[sortedData.length - 1].timestamp;
        const latestTimestampDate = new Date(latestTimestamp * 1000);
        latestTimestampDate.setHours(0, 0, 0, 0);
        const startOfDayTimestamp = Math.floor(latestTimestampDate.getTime() / 1000);

        referenceLines.push({
            x: startOfDayTimestamp,
            label: formatEpoch(startOfDayTimestamp, 'dayMonth'),
            color: 'LightGray',
            labelPosition: 'insideTopLeft',
            strokeDasharray: "5 5"
        })

        // Freezing Temperature
        if (dataType === MeasurementType.TEMPERATURE) {
            referenceLines.push({
                y: unitSystem === UnitSystem.METRIC ? 0 : 32,
                color: 'LightSkyBlue',
                strokeDasharray: "5 5"
            })
        }

        return referenceLines;
    }

    return (
        <Card mt="md" radius="md" shadow="sm">
            <Text size="md" mb="sm">{chartTitle} ({unitStr})</Text>
            <LineChart
                data={sortedData}
                w="100%"
                h={200}
                dotProps={{r: 0}}
                dataKey="timestamp"
                series={getSeriesData()}
                tooltipProps={{
                    content: ({label, payload}) => (
                        <ChartTooltip
                            label={formatEpoch(label, 'dayMonth24hTime')}
                            payload={payload}
                            dataType={dataType}/>
                    ),
                }}
                referenceLines={generateReferenceLines()}
                yAxisProps={{domain: yAxisBounds ? yAxisBounds : computeYAxisBounds()}}
                xAxisProps={{
                    type: 'number',
                    domain: ['dataMin', 'dataMax'],
                    tickFormatter: (value: number) => formatEpoch(value, '24hTime')
                }}
                gridAxis="xy"
                curveType="natural"
            />
        </Card>
    )
}

export default LineChartCard;