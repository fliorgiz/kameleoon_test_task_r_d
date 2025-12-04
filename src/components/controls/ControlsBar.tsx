import React, { useEffect, useRef, useState } from 'react';
import styles from './ControlsBar.module.css';
import type { LineStyle, TimeMode, PreparedVariation } from '../../types';

interface Props {
    timeMode: TimeMode;
    onTimeModeChange: (mode: TimeMode) => void;
    lineStyle: LineStyle;
    onLineStyleChange: (style: LineStyle) => void;
    variations: PreparedVariation[];
    selectedIds: string[];
    onToggleVariation: (id: string) => void;
    onExport: () => void;
}

const LINE_STYLE_LABEL: Record<LineStyle, string> = {
    line: 'line',
    smooth: 'smooth',
    area: 'area',
};

const TIME_LABEL: Record<TimeMode, string> = {
    day: 'Day',
    week: 'Week',
};

export const ControlsBar: React.FC<Props> = ({
    timeMode,
    onTimeModeChange,
    lineStyle,
    onLineStyleChange,
    variations,
    selectedIds,
    onToggleVariation,
    onExport,
}) => {
    const [openVariations, setOpenVariations] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const [openStyle, setOpenStyle] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) {
                setOpenVariations(false);
                setOpenTime(false);
                setOpenStyle(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const allSelected = selectedIds.length === variations.length;

    const variationsLabel = (() => {
        if (allSelected) return 'All variations selected';
        if (selectedIds.length === 1) {
            const v = variations.find((x) => x.id === selectedIds[0]);
            return v ? v.name : '1 variation selected';
        }
        return `${selectedIds.length} variations selected`;
    })();

    const handleSelectTime = (mode: TimeMode) => {
        onTimeModeChange(mode);
        setOpenTime(false);
    };

    const handleSelectStyle = (style: LineStyle) => {
        onLineStyleChange(style);
        setOpenStyle(false);
    };

    const toggleVariation = (id: string) => {
        onToggleVariation(id);
    };

    return (
        <div
            className={styles.bar}
            ref={rootRef}
            onClick={() => {
                setOpenVariations(false);
                setOpenTime(false);
                setOpenStyle(false);
            }}
        >
            <div className={styles.left}>
                <div
                    className={`${styles.select} ${
                        openVariations ? styles.selectOpen : ''
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenVariations((v) => !v);
                        setOpenTime(false);
                        setOpenStyle(false);
                    }}
                >
                    <span className={styles.selectValue}>{variationsLabel}</span>
                    <span className={styles.selectArrow}>
                        <ArrowIcon />
                    </span>

                    {openVariations && (
                        <div className={styles.selectOptionsWide}>
                            {variations.map((v) => {
                                const checked = selectedIds.includes(v.id);
                                const disabled =
                                    checked && selectedIds.length === 1;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        className={`${styles.selectOptionRow} ${
                                            disabled
                                                ? styles.optionDisabled
                                                : ''
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (disabled) return;
                                            toggleVariation(v.id);
                                        }}
                                    >
                                        <span className={styles.optionLeft}>
                                            <span
                                                className={styles.optionDot}
                                                style={{
                                                    backgroundColor: v.color,
                                                }}
                                            />
                                            <span>{v.name}</span>
                                        </span>
                                        <span
                                            className={`${styles.checkbox} ${
                                                checked
                                                    ? styles.checkboxChecked
                                                    : ''
                                            }`}
                                        >
                                            {checked && '✓'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div
                    className={`${styles.select} ${
                        openTime ? styles.selectOpen : ''
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenTime((v) => !v);
                        setOpenVariations(false);
                        setOpenStyle(false);
                    }}
                >
                    <span className={styles.selectValue}>
                        {TIME_LABEL[timeMode]}
                    </span>
                    <span className={styles.selectArrow}>
                        <ArrowIcon />
                    </span>
                    {openTime && (
                        <div className={styles.selectOptions}>
                            {(['day', 'week'] as TimeMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    className={`${styles.selectOption} ${
                                        mode === timeMode
                                            ? styles.selectOptionActive
                                            : ''
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectTime(mode);
                                    }}
                                >
                                    {TIME_LABEL[mode]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className={`${styles.select} ${
                        openStyle ? styles.selectOpen : ''
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenStyle((v) => !v);
                        setOpenVariations(false);
                        setOpenTime(false);
                    }}
                >
                    <span className={styles.selectValue}>
                        Line style: {LINE_STYLE_LABEL[lineStyle]}
                    </span>
                    <span className={styles.selectArrow}>
                        <ArrowIcon />
                    </span>
                    {openStyle && (
                        <div className={styles.selectOptions}>
                            {(
                                ['line', 'smooth', 'area'] as LineStyle[]
                            ).map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    className={`${styles.selectOption} ${
                                        style === lineStyle
                                            ? styles.selectOptionActive
                                            : ''
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectStyle(style);
                                    }}
                                >
                                    Line style: {LINE_STYLE_LABEL[style]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className={styles.exportButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onExport();
                        setOpenVariations(false);
                        setOpenTime(false);
                        setOpenStyle(false);
                    }}
                >
                    Export PNG
                </button>
            </div>
        </div>
    );
};

const ArrowIcon: React.FC = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        aria-hidden="true"
    >
        <path
            d="M3 4.5L6 7.5L9 4.5"
            fill="none"
            stroke="#5E5D67"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
