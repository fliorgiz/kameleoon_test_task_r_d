export interface Variation {
    id?: number;
    name: string;
}

export interface RawRow {
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
}

export interface RawData {
    variations: Variation[];
    data: RawRow[];
}

export type LineStyle = 'line' | 'smooth' | 'area';
export type TimeMode = 'day' | 'week';
export type ThemeMode = 'light' | 'dark';

export interface ChartPoint {
    date: string;
    label: string;
    timestamp: number;
    [key: string]: string | number | null;
}

export interface PreparedVariation {
    id: string;
    name: string;
    dataKey: string;
    color: string;
}
  