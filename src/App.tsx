import React, { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import styles from './App.module.css';
import { AbTestChart } from './components/charts/AbTestChart';
import { ControlsBar } from './components/controls/ControlsBar';
import type { LineStyle, ThemeMode, TimeMode } from './types';
import { prepareChartData, prepareVariations } from './utils';

const variations = prepareVariations();

const App: React.FC = () => {
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [timeMode, setTimeMode] = useState<TimeMode>('day');
    const [lineStyle, setLineStyle] = useState<LineStyle>('line');
    const [selectedIds, setSelectedIds] = useState<string[]>(
        variations.map((v) => v.id),
    );

    const chartRef = useRef<HTMLDivElement | null>(null);

    const displayedData = useMemo(
        () => prepareChartData(timeMode, variations),
        [timeMode],
    );

    const yDomain = useMemo<[number, number]>(() => {
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;

        for (const row of displayedData) {
            for (const id of selectedIds) {
                const dataKey = `v${id}`;
                const value = row[dataKey];
                if (typeof value === 'number' && !Number.isNaN(value)) {
                    if (value < min) min = value;
                    if (value > max) max = value;
                }
            }
        }

        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            return [0, 1];
        }

        const padding = (max - min) * 0.15 || 2;
        const lower = Math.max(0, min - padding);
        const upper = max + padding;
        return [Math.floor(lower), Math.ceil(upper)];
    }, [displayedData, selectedIds]);

    const handleToggleVariation = (id: string) => {
        setSelectedIds((prev) => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                if (prev.length === 1) {
                    return prev;
                }
                return prev.filter((x) => x !== id);
            }
            return [...prev, id];
        });
    };

    const handleExport = async () => {
        if (!chartRef.current) return;
        try {
            const dataUrl = await toPng(chartRef.current, { cacheBust: true });
            const link = document.createElement('a');
            link.download = 'ab-test-chart.png';
            link.href = dataUrl;
            link.click();
        } catch (e) {
            console.error('Export failed', e);
        }
    };

    return (
        <div className={`${styles.app} ${theme === 'dark' ? styles.dark : ''}`}>
            <div className={styles.shell}>
                <div className={styles.headerRow}>
                    <div>
                        <div className={styles.title}>Group 13998</div>
                        <div className={styles.subtitle}>
                            Conversion rate by variation
                        </div>
                    </div>
                    <div className={styles.rightControls}>
                        <button
                            className={`${styles.themeToggle} ${
                                theme === 'light' ? styles.themeToggleActive : ''
                            }`}
                            onClick={() => setTheme('light')}
                        >
                            Light
                        </button>
                        <button
                            className={`${styles.themeToggle} ${
                                theme === 'dark' ? styles.themeToggleActive : ''
                            }`}
                            onClick={() => setTheme('dark')}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <ControlsBar
                    timeMode={timeMode}
                    onTimeModeChange={setTimeMode}
                    lineStyle={lineStyle}
                    onLineStyleChange={setLineStyle}
                    variations={variations}
                    selectedIds={selectedIds}
                    onToggleVariation={handleToggleVariation}
                    onExport={handleExport}
                />

                <div className={styles.mainRow}>
                    <div className={styles.chartCol}>
                        <AbTestChart
                            displayedData={displayedData}
                            variations={variations}
                            selectedIds={selectedIds}
                            lineStyle={lineStyle}
                            yDomain={yDomain}
                            theme={theme}
                            chartRef={chartRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
