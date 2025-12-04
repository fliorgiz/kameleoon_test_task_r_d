import React from 'react';
import styles from './VariationsSelector.module.css';
import type { PreparedVariation } from '../../types';

interface Props {
  variations: PreparedVariation[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const VariationsSelector: React.FC<Props> = ({
  variations,
  selectedIds,
  onToggle,
}) => {
  return (
    <div className={styles.box}>
      <div className={styles.title}>Variations</div>
      <div className={styles.list}>
        {variations.map((v) => {
          const active = selectedIds.includes(v.id);
          return (
            <div
              key={v.id}
              className={styles.item}
              onClick={() => onToggle(v.id)}
            >
              <div className={styles.left}>
                <div
                  className={styles.swatch}
                  style={{ backgroundColor: v.color }}
                />
                <span className={styles.name}>{v.name}</span>
              </div>
              <div
                className={`${styles.checkbox} ${
                  active ? styles.checkboxActive : ''
                }`}
              >
                {active ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.hint}>At least one variation must be selected.</div>
    </div>
  );
};
