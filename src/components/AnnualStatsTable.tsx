import {Card, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title} from "@mantine/core";
import {AnnualWeatherData} from "@/data/network";
import {formatMonthNumberToMonthName} from "@/data/util";
import {getUnit} from "@/data/conversion";
import {MeasurementType, UnitSystem} from "@/data/constants";

type AnnualStatsTableProps = {
    data: AnnualWeatherData[] | undefined,
    unitSystem: UnitSystem,
    title: string
}

const AnnualStatsTable = (props: AnnualStatsTableProps) => {
    const temperatureUnitStr = getUnit(MeasurementType.TEMPERATURE, props.unitSystem);

    return <Card mt="md" radius="md" shadow="sm">
        <Title order={4} mb="md">{props.title}</Title>
        <Table>
            <TableThead>
                <TableTr>
                    <TableTh>Month</TableTh>
                    <TableTh>High</TableTh>
                    <TableTh>Low</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {
                    props?.data?.map((item, index) => (
                        <TableTr key={index}>
                            <TableTd>{formatMonthNumberToMonthName(item.month_index)}</TableTd>
                            <TableTd>{item.max}{temperatureUnitStr}</TableTd>
                            <TableTd>{item.min}{temperatureUnitStr}</TableTd>
                        </TableTr>
                    ))
                }
            </TableTbody>
        </Table>
    </Card>
}

export default AnnualStatsTable;