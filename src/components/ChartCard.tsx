'use client'

import {LineChart} from "@mantine/charts";
import {Card, Paper, Text} from "@mantine/core";
import {PastWeatherData} from "@/data/network";
import {formatEpochToTimezone} from "@/data/util";
import {MeasurementType, UnitSystem} from "@/data/constants";
import {getUnit} from "@/data/conversion";

type ChartCardProps = {
    data: PastWeatherData[] | undefined,
    dataType: MeasurementType,
    lineColor: string,
    unitSystem: UnitSystem,
    chartTitle: string,
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

const ChartCard = ({data, dataType, lineColor, unitSystem, chartTitle}: ChartCardProps) => {

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
            <Text size="md" mb="sm">{chartTitle}</Text>
            <LineChart
                data={data ? formatDataArray(data) : []}
                w="100%"
                h={300}
                xAxisProps={{interval: 180}}
                dotProps={{r: 0}}
                dataKey="dateTime"
                series={[
                    {name: "value", color: lineColor},
                ]}
                tooltipProps={{
                    content: ({label, payload}) => <ChartTooltip label={label} payload={payload}/>,
                }}
                gridAxis="xy"
                curveType="natural"
                valueFormatter={value => `${value}${unitStr}`}
                connectNulls
            />
        </Card>
    )
}

export default ChartCard;