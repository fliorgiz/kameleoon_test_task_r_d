import React from 'react';
import styles from './ChartTooltip.module.css';
import type { PreparedVariation, ThemeMode } from '../../types';

interface RechartsPointPayload {
    date?: string;
    [key: string]: unknown;
}

interface TooltipEntry {
    dataKey?: string;
    value?: number;
    payload?: RechartsPointPayload;
}

interface Props {
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

const CalendarIcon: React.FC = () => (
    <svg
        className={styles.calendarIcon}
        width="18"
        height="18"
        viewBox="0 0 16 16"
        aria-hidden="true"
    >
        <path
            d="M12 5L13 5L13 3L14.75 3C14.8877 3 15 3.11182 15 3.25L15 14.75C15 14.8882 14.8877 15 14.75 15L1.25 15C1.1123 15 1 14.8882 1 14.75L1 3.25C1 3.11182 1.1123 3 1.25 3L3 3L3 5L4 5L4 3L12 3L12 5Z"
            fill="#5E5D67"
            fillRule="evenodd"
        />
    </svg>
);

export const ChartTooltip: React.FC<Props> = ({
    active,
    label,
    payload,
    variations,
    theme,
}) => {
    if (!active || !payload || !payload.length || !variations) {
        return null;
    }

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
        .filter((entry) => entry && typeof entry.dataKey === 'string')
        .map((entry) => ({
            dataKey: entry.dataKey as string,
            value: typeof entry.value === 'number' ? entry.value : null,
        }))
        .filter((entry) => entry.value !== null);

    if (!rows.length) {
        return null;
    }

    rows.sort((a, b) => {
        const av = a.value ?? Number.NEGATIVE_INFINITY;
        const bv = b.value ?? Number.NEGATIVE_INFINITY;
        return bv - av;
    });

    const isDark = theme === 'dark';
    const tooltipClassName = `${styles.tooltip} ${
        isDark ? styles.tooltipDark : styles.tooltipLight
    }`;

    return (
        <div className={tooltipClassName}>
            <div className={styles.header}>
                <CalendarIcon />
                <span className={styles.date}>{displayDate}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.rows}>
                {rows.map((entry) => {
                    const v = variationByKey.get(entry.dataKey);
                    if (!v) return null;

                    const valueLabel = formatPercentWithComma(entry.value!);

                    return (
                        <div
                            key={entry.dataKey}
                            className={styles.row}
                        >
                            <div className={styles.rowLeft}>
                                <span
                                    className={styles.dot}
                                    style={{ backgroundColor: v.color }}
                                />
                                <span className={styles.name}>{v.name}</span>
                            </div>
                            <span className={styles.value}>{valueLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
