# A/B Test Conversion Rate Chart

Интерактивный график конверсии по вариациям для A/B-теста.  
Стек: **React + TypeScript + Vite + Recharts**.

## Live demo

GitHub Pages: https://fliorgiz.github.io/kameleoon_test_task_r_d/

---

## Библиотека визуализации

Для построения графика используется **[Recharts](https://recharts.org/)**:

- `ComposedChart` + `Line` + `Area`
- `ResponsiveContainer`, `Tooltip`, `CartesianGrid`, `XAxis`, `YAxis`

---

## Функциональность

### Реализовано по заданию

- График **conversion rate** для всех вариаций (данные из `data.json`).
- Конверсия: `(conversions / visits) * 100`, все значения в процентах.
- Tooltip при наведении:
  - Вертикальный курсор
  - Дата в формате `DD/MM/YYYY` с иконкой календаря
  - Значения по каждой вариации.
- Селектор вариаций:
  - Включение/выключение отдельных линий
  - Гарантия, что всегда выбрана минимум одна вариация.
- Переключатель **Day / Week** (агрегация по дням или неделям).
- Адаптивная вёрстка в диапазоне ~670–1300 px.
- Стилизация через **CSS Modules**.

### Бонусные функции

- **Line style selector** — выпадающий список:
  - `line`, `smooth (monotone)`, `area` (заливка под линией).
- **Light / Dark theme**:
  - Переключение темы, адаптация цветов графика и tooltip-ов.
- **Export to PNG**:
  - Кнопка **Export PNG** сохраняет текущий вид графика (учитывая тему и выбранные вариации).

---

## Локальный запуск

### Требования

- **Node.js**: `>= 20.19`
- **npm**

### Установка и запуск

```bash
# клонировать репозиторий
git clone https://github.com/fliorgiz/kameleoon_test_task_r_d.git
cd kameleoon_test_task_r_d

# установить зависимости
npm install

# запустить dev-сервер
npm run dev
