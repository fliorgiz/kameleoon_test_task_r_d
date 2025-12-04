import type { ChartPoint, RawData, TimeMode, PreparedVariation } from './types';

import rawJson from './data.json';

export const rawData = rawJson as RawData;

export const prepareVariations = (): PreparedVariation[] => {
const baseColors = ['#4B5563', '#2563EB', '#F97316', '#8B5CF6'];
    return rawData.variations.map((v, index) => ({
        id: (v.id ?? 0).toString(),
        name: v.name,
        dataKey: `v${v.id ?? 0}`,
        color: baseColors[index % baseColors.length],
    }));
};

const getWeekKey = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day + 3);
    const year = d.getUTCFullYear();
    const firstThursday = new Date(Date.UTC(year, 0, 4));
    const diff = +d - +firstThursday;
    const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
};

export const prepareChartData = (
    mode: TimeMode,
    variations: PreparedVariation[],
): ChartPoint[] => {
    if (mode === 'day') {
        return rawData.data.map((row) => {
            const point: ChartPoint = {
            date: row.date,
            label: row.date.slice(5),
            timestamp: new Date(row.date + 'T00:00:00Z').getTime(),
        };

        for (const v of variations) {
            const visits = row.visits[v.id];
            const conv = row.conversions[v.id];
            if (visits && conv) {
                point[v.dataKey] = (conv / visits) * 100;
            } else {
                point[v.dataKey] = null;
            }
        }

        return point;
        });
    }

const weekMap = new Map<
    string,
    {
        weekLabel: string;
        timestamp: number;
        visits: Record<string, number>;
        conversions: Record<string, number>;
    }
>();

for (const row of rawData.data) {
    const key = getWeekKey(row.date);
    let bucket = weekMap.get(key);
    if (!bucket) {
        const d = new Date(row.date + 'T00:00:00Z');
        bucket = {
            weekLabel: key,
            timestamp: d.getTime(),
            visits: {},
            conversions: {},
        };
        weekMap.set(key, bucket);
    }

    for (const v of variations) {
        const id = v.id;
        const vVisits = row.visits[id];
        const vConv = row.conversions[id];
        if (!bucket.visits[id]) bucket.visits[id] = 0;
        if (!bucket.conversions[id]) bucket.conversions[id] = 0;
        if (vVisits) bucket.visits[id] += vVisits;
        if (vConv) bucket.conversions[id] += vConv;
    }
}

const result: ChartPoint[] = [];

for (const [key, bucket] of weekMap) {
    const point: ChartPoint = {
        date: key,
        label: key,
        timestamp: bucket.timestamp,
    };

    for (const v of variations) {
        const visits = bucket.visits[v.id];
        const conv = bucket.conversions[v.id];
        if (visits && conv) {
            point[v.dataKey] = (conv / visits) * 100;
        } else {
            point[v.dataKey] = null;
        }
    }

    result.push(point);
}

    result.sort((a, b) => a.timestamp - b.timestamp);
    return result;
};

export const formatPercent = (value?: number | null): string => {
    if (value == null || Number.isNaN(value)) return '–';
    return `${value.toFixed(2)}%`;
};
