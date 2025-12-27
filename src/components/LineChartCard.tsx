'use client'

import {ChartReferenceLineProps, LineChart} from "@mantine/charts";
import {Card, Paper, Text} from "@mantine/core";
import {PastWeatherData} from "@/data/network";
import {formatEpoch, getMaxWithTimestamp, getMinWithTimestamp, roundToFive} from "@/data/util";
import {MeasurementType, UnitSystem} from "@/data/constants";
import {getUnit} from "@/data/conversion";

type ChartCardProps = {
    data: PastWeatherData[] | undefined,
    dataType: MeasurementType,
    lineColor: string,
    unitSystem: UnitSystem,
    chartTitle: string,
    yAxisBounds?: number[]
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

const LineChartCard = ({data, dataType, lineColor, unitSystem, chartTitle, yAxisBounds}: ChartCardProps) => {
    if (!yAxisBounds) {
        switch (dataType) {
            case MeasurementType.TEMPERATURE:
                const minTemp = getMinWithTimestamp(data)?.value || -89;
                const maxTemp = getMaxWithTimestamp(data)?.value || 59;
                // Pad the max and min values and round to the nearest 5 - this prevents data "kissing" the chart edges
                yAxisBounds = [roundToFive(minTemp - 1, 'down'), roundToFive(maxTemp + 1, 'up')];
                break;
            case MeasurementType.HUMIDITY:
                yAxisBounds = [0, 100];
                break;
            case MeasurementType.PRESSURE:
                const minPressure = getMinWithTimestamp(data)?.value;
                const maxPressure = getMaxWithTimestamp(data)?.value;
                // Pad the max and min values and round to the nearest 5 similar to temperatures
                if (unitSystem === UnitSystem.METRIC) {
                    // Slightly higher padding for metric units
                    yAxisBounds = [minPressure ? roundToFive(minPressure - 1, 'down') : 850,
                        maxPressure ? roundToFive(maxPressure + 1, 'up') : 1100];
                } else {
                    yAxisBounds = [minPressure ? roundToFive(minPressure - 1, 'down') : 25,
                        maxPressure ? roundToFive(maxPressure + 1, 'up') : 33];
                }
        }
    }

    const unitStr = getUnit(dataType, unitSystem);

    const ChartTooltip = ({label, payload, dataType}: ChartTooltipProps) => {
        if (!payload) return null;

        return (
            <Paper px="md" py="sm" withBorder shadow="md" radius="md">
                <Text fw={500} mb={5}>{label}</Text>
                {payload.map((item: ChartPayloadItem) => (
                    <Text key={item.name} c={item.color} fz="sm">
                        {`${item.value}${dataType === MeasurementType.PRESSURE ? ' ' : ''}${unitStr}`}
                    </Text>
                ))}
            </Paper>
        );
    }

    const getFormattedDataArray = () => {
        if (!data) return [];

        return data.sort((a, b) => a.timestamp - b.timestamp).map(item => {
            return {
                timestamp: item.timestamp,
                value: item.value
            }
        })
    };

    const referenceDateLine = (): ChartReferenceLineProps[] => {
        const formattedDataArray = getFormattedDataArray();
        if (!formattedDataArray || formattedDataArray.length === 0) return [];

        const latestTimestamp = formattedDataArray[formattedDataArray.length - 1].timestamp;
        const latestTimestampDate = new Date(latestTimestamp * 1000);
        latestTimestampDate.setHours(0, 0, 0, 0);
        const startOfDayTimestamp = Math.floor(latestTimestampDate.getTime() / 1000);

        return [
            {
                x: startOfDayTimestamp,
                label: formatEpoch(startOfDayTimestamp, 'dayMonth'),
                color: 'gray',
                labelPosition: 'insideTopLeft'
            },
        ]
    }

    return (
        <Card mt="md" radius="md" shadow="sm">
            <Text size="md" mb="sm">{chartTitle} ({unitStr})</Text>
            <LineChart
                data={getFormattedDataArray()}
                w="100%"
                h={200}
                dotProps={{r: 0}}
                dataKey="timestamp"
                series={[
                    {name: "value", color: lineColor},
                ]}
                tooltipProps={{
                    content: ({label, payload}) => (
                        <ChartTooltip
                            label={formatEpoch(label, 'dayMonth24hTime')}
                            payload={payload}
                            dataType={dataType}/>
                    ),
                }}
                referenceLines={referenceDateLine()}
                yAxisProps={{domain: yAxisBounds}}
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