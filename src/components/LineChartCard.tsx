'use client'

import {LineChart} from "@mantine/charts";
import {Card, Paper, Text} from "@mantine/core";
import {PastWeatherData} from "@/data/network";
import {formatEpochToTimezone, getMaxWithTimestamp, getMinWithTimestamp} from "@/data/util";
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
}

const LineChartCard = ({data, dataType, lineColor, unitSystem, chartTitle, yAxisBounds}: ChartCardProps) => {
    if (!yAxisBounds) {
        switch (dataType) {
            case MeasurementType.TEMPERATURE:
                const minTemp = getMinWithTimestamp(data)?.value || -90;
                const maxTemp = getMaxWithTimestamp(data)?.value || 60;
                yAxisBounds = [Math.floor(minTemp - 10), Math.ceil(maxTemp + 10)];
                break;
            case MeasurementType.HUMIDITY:
                yAxisBounds = [0, 100];
                break;
            case MeasurementType.PRESSURE:
                const minPressure = getMinWithTimestamp(data)?.value;
                const maxPressure = getMaxWithTimestamp(data)?.value;
                if (unitSystem === UnitSystem.METRIC) {
                    yAxisBounds = [minPressure ? Math.floor(minPressure - 10) : 850, maxPressure ? Math.ceil(maxPressure + 10) : 1100];
                } else {
                    yAxisBounds = [minPressure ? Math.floor(minPressure - 1) : 25, maxPressure ? Math.ceil(maxPressure + 1) : 33];
                }
        }
    }

    const unitStr = getUnit(dataType, unitSystem);

    const formatDataArray = (data: PastWeatherData[]) => {
        return data.sort((a, b) => a.timestamp - b.timestamp).map(item => {
            const formattedDateTime = formatEpochToTimezone(item.timestamp, 'America/New_York');

            return {
                dateTime: formattedDateTime,
                value: item.value
            };
        });
    }

    const ChartTooltip = ({label, payload}: ChartTooltipProps) => {
        if (!payload) return null;

        return (
            <Paper px="md" py="sm" withBorder shadow="md" radius="md">
                <Text fw={500} mb={5}>{label}</Text>
                {payload.map((item: ChartPayloadItem) => (
                    <Text key={item.name} c={item.color} fz="sm">
                        {`${item.value}${unitStr}`}
                    </Text>
                ))}
            </Paper>
        );
    }

    return (
        <Card mt="md" radius="md" shadow="sm">
            <Text size="md" mb="sm">{chartTitle} ({unitStr})</Text>
            <LineChart
                data={data ? formatDataArray(data) : []}
                w="100%"
                h={200}
                xAxisProps={{interval: 180}}
                dotProps={{r: 0}}
                dataKey="dateTime"
                series={[
                    {name: "value", color: lineColor},
                ]}
                tooltipProps={{
                    content: ({label, payload}) => <ChartTooltip label={label} payload={payload}/>,
                }}
                yAxisProps={{domain: yAxisBounds}}
                gridAxis="xy"
                curveType="natural"
                valueFormatter={value => `${value}`}
                connectNulls
            />
        </Card>
    )
}

export default LineChartCard;