import {Card, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title} from "@mantine/core";
import {formatMonthIndexToMonthName} from "@/data/util";
import {getUnit} from "@/data/conversion";
import {MeasurementType, UnitSystem} from "@/data/constants";
import {AnnualWeatherData} from "@/data/types";

type AnnualStatsTableProps = {
    data: AnnualWeatherData[] | undefined,
    unitSystem: UnitSystem,
    title: string
}

/**
 * Returns the day of the month for a given Unix timestamp.
 * @param timestamp
 */
const getDayFromTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate(); // Get the day as a number (1-31)

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        // Use the suffix based on the last digit,
        // but default to "th" for 11, 12, 13 and anything else.
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return getOrdinal(day);
}

const AnnualStatsTable = (props: AnnualStatsTableProps) => {
    const temperatureUnitStr = getUnit(MeasurementType.TEMPERATURE, props.unitSystem);

    return <Card mt="md" radius="md" shadow="sm">
        <Title order={4} mb="md">{props.title}</Title>
        <Table>
            <TableThead>
                <TableTr>
                    <TableTh></TableTh>
                    <TableTh>High</TableTh>
                    <TableTh>Low</TableTh>
                    <TableTh>Average</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {
                    props?.data?.map((item, index) => (
                        <TableTr key={index}>
                            <TableTd>{formatMonthIndexToMonthName(item.monthIndex)}</TableTd>
                            <TableTd>{item.temperature.max}{temperatureUnitStr} ({getDayFromTimestamp(item.temperature.maxTimestamp)})</TableTd>
                            <TableTd>{item.temperature.min}{temperatureUnitStr} ({getDayFromTimestamp(item.temperature.minTimestamp)})</TableTd>
                            <TableTd>{item.temperature.avg}{temperatureUnitStr}</TableTd>
                        </TableTr>
                    ))
                }
            </TableTbody>
        </Table>
    </Card>
}

export default AnnualStatsTable;