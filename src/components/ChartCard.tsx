import {LineChart} from "@mantine/charts";
import {Card, Paper, Text} from "@mantine/core";
import {PastWeatherData} from "@/data/network";

type ChartCardProps = {
    data: PastWeatherData[] | undefined,
    dataType: string,
    lineColor: string,
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

const ChartCard = ({data, dataType, lineColor, chartTitle}: ChartCardProps) => {

    let unitStr;
    switch (dataType) {
        case "temperature":
            unitStr = "°C";
            break;
        case "humidity":
            unitStr = "%";
            break;
        default:
            unitStr = "";
            break;
    }

    const formatDataArray = (data: PastWeatherData[]) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return data.sort((a, b) => a.timestamp - b.timestamp).map(item => {
            const d = new Date(item.timestamp * 1000);

            const month = monthNames[d.getUTCMonth()]
            const day = d.getUTCDate();
            const hours = d.getUTCHours();
            const minutes = d.getUTCMinutes();

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const formattedDateTime = `${month} ${day} ${formattedTime}`;

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
                dotProps={{r: 0}}
                dataKey="dateTime"
                series={[
                    {name: "value", color: lineColor, label: dataType},
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