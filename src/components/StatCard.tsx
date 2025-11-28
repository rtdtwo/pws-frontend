import { Card, Stack, Text, Group } from '@mantine/core';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <Card shadow="sm" p="md" radius="md">
            <Stack gap="xs">
                <Group gap="xs">
                    <div style={{ color }}>{icon}</div>
                    <Text size="sm" c="dimmed">{title}</Text>
                </Group>
                <Text size="xl">{value}</Text>
            </Stack>
        </Card>
    );
}
