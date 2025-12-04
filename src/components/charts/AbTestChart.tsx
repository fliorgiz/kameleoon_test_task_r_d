import React from 'react';
import {
    CartesianGrid,
    Line,
    ComposedChart,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Area,
} from 'recharts';
import styles from './AbTestChart.module.css';
import type {
    ChartPoint,
    LineStyle,
    PreparedVariation,
    ThemeMode,
} from '../../types';

interface Props {
    displayedData: ChartPoint[];
    variations: PreparedVariation[];
    selectedIds: string[];
    lineStyle: LineStyle;
    yDomain: [number, number];
    theme: ThemeMode;
    chartRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const AbTestChart: React.FC<Props> = ({
    displayedData,
    variations,
    selectedIds,
    lineStyle,
    yDomain,
    theme,
    chartRef,
}) => {
    const visibleVariations = variations.filter((v) =>
        selectedIds.includes(v.id),
    );

    const type = lineStyle === 'smooth' ? 'monotone' : 'linear';
    const isArea = lineStyle === 'area';
    const isDark = theme === 'dark';

    const strokeWidth =
        lineStyle === 'smooth' ? 3 : lineStyle === 'line' ? 2 : 1.8;
    const activeDotRadius = lineStyle === 'smooth' ? 5 : 4;

    const axisColor = isDark ? '#9ca3af' : '#6b7280';
    const gridColor = isDark ? '#1f2937' : '#e5e7eb';

    return (
        <div className={styles.wrapper}>
            <div className={styles.chartCard} ref={chartRef}>
                <div className={styles.chartInner}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={displayedData}
                            margin={{ left: 0, right: 10, top: 10, bottom: 10 }}
                        >
                            <CartesianGrid
                                stroke={gridColor}
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={yDomain}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{
                                    stroke: isDark ? '#4b5563' : '#9ca3af',
                                    strokeDasharray: '3 3',
                                }}
                                content={
                                    <CustomTooltip
                                        variations={variations}
                                        theme={theme}
                                    />
                                }
                            />

                            {visibleVariations.map((v) =>
                                isArea ? (
                                    <Area
                                        key={`area-${v.id}`}
                                        type={type}
                                        dataKey={v.dataKey}
                                        stroke={v.color}
                                        strokeWidth={strokeWidth}
                                        fill={v.color}
                                        fillOpacity={0.2}
                                        activeDot={{ r: activeDotRadius }}
                                        connectNulls
                                    />
                                ) : (
                                    <Line
                                        key={`line-${v.id}`}
                                        type={type}
                                        dataKey={v.dataKey}
                                        stroke={v.color}
                                        strokeWidth={strokeWidth}
                                        strokeOpacity={
                                            lineStyle === 'smooth' ? 0.9 : 1
                                        }
                                        dot={false}
                                        activeDot={{ r: activeDotRadius }}
                                        connectNulls
                                    />
                                ),
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

interface RechartsPointPayload {
    date?: string;
    [key: string]: unknown;
}

interface TooltipEntry {
    dataKey?: string;
    value?: number;
    payload?: RechartsPointPayload;
}

interface TooltipProps {
    active?: boolean;
    label?: string;
    payload?: TooltipEntry[];
    variations?: PreparedVariation[];
    theme: ThemeMode;
}

const formatDateLabel = (raw?: string, fallback?: string): string => {
    if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        const y = raw.slice(0, 4);
        const m = raw.slice(5, 7);
        const d = raw.slice(8, 10);
        return `${d}/${m}/${y}`;
    }
    return fallback ?? '';
};

const formatPercentWithComma = (value: number | null): string => {
    if (value == null || Number.isNaN(value)) return '–';
    return `${value.toFixed(2).replace('.', ',')}%`;
};

const CALENDAR_ICON = (
    <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ marginRight: 6 }}
    >
        <path
            d="M12 5L13 5L13 3L14.75 3C14.8877 3 15 3.11182 15 3.25L15 14.75C15 14.8882 14.8877 15 14.75 15L1.25 15C1.1123 15 1 14.8882 1 14.75L1 3.25C1 3.11182 1.1123 3 1.25 3L3 3L3 5L4 5L4 3L12 3L12 5Z"
            fill="#5E5D67"
            fillRule="evenodd"
        />
    </svg>
);

const CustomTooltip: React.FC<TooltipProps> = ({
    active,
    label,
    payload,
    variations,
    theme,
}) => {
    if (!active || !payload || !payload.length || !variations) return null;

    const isDarkTheme = theme === 'dark';
    const textColor = isDarkTheme ? '#ffffff' : '#111827';
    const headerColor = isDarkTheme ? '#ffffff' : '#5e5d67';
    const rowBorderColor = isDarkTheme
        ? 'rgba(148,163,184,0.75)'
        : 'rgba(148,163,184,0.35)';

    const variationByKey = new Map<string, PreparedVariation>();
    variations.forEach((v) => variationByKey.set(v.dataKey, v));

    const firstPayload = payload[0]?.payload;
    const payloadDate =
        firstPayload && typeof firstPayload.date === 'string'
            ? firstPayload.date
            : undefined;
    const rawDate: string | undefined =
        payloadDate || (typeof label === 'string' ? label : undefined);
    const displayDate = formatDateLabel(rawDate, label);

    const rows = (payload || [])
        .filter((e) => e && typeof e.dataKey === 'string')
        .map((e) => ({
            dataKey: e.dataKey as string,
            value: typeof e.value === 'number' ? e.value : null,
        }))
        .filter((e) => e.value !== null);

    if (!rows.length) return null;

    rows.sort(
        (a, b) =>
            (b.value ?? Number.NEGATIVE_INFINITY) -
            (a.value ?? Number.NEGATIVE_INFINITY),
    );

    return (
        <div
            style={{
                background: 'var(--panel-bg)',
                borderRadius: 4,
                padding: '10px 12px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 20px rgba(15,23,42,0.35)',
                fontSize: 12,
                minWidth: 210,
                color: textColor,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    color: headerColor,
                    fontWeight: 500,
                }}
            >
                {CALENDAR_ICON}
                <span>{displayDate}</span>
            </div>

            <div
                style={{
                    height: 1,
                    background:
                        'linear-gradient(to right, rgba(148,163,184,0.2), rgba(148,163,184,0.05))',
                    marginBottom: 8,
                }}
            />

            <div style={{ maxHeight: 180, overflowY: 'auto', paddingRight: 2 }}>
                {rows.map((entry) => {
                    const v = variationByKey.get(entry.dataKey);
                    if (!v) return null;

                    const valueLabel = formatPercentWithComma(entry.value!);

                    return (
                        <div
                            key={entry.dataKey}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                marginBottom: 4,
                                padding: '6px 8px',
                                borderRadius: 4,
                                border: `1px dashed ${rowBorderColor}`,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 999,
                                        backgroundColor: v.color,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: textColor,
                                    }}
                                >
                                    {v.name}
                                </span>
                            </div>
                            <span
                                style={{
                                    fontVariantNumeric: 'tabular-nums',
                                    fontWeight: 500,
                                    color: textColor,
                                }}
                            >
                                {valueLabel}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
