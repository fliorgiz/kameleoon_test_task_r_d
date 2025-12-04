# A/B Test Conversion Rate Chart

Интерактивный график конверсии по вариациям для A/B-теста.  
Проект выполнен на **React + TypeScript** с использованием **Recharts** и опубликован на GitHub Pages.

---

## Live demo

**GitHub Pages:**  
https://fliorgiz.github.io/kameleoon_test_task_r_d/

---

## Tech stack

- **React** + **TypeScript**
- **Vite**
- **Recharts** — библиотека визуализации (line / area charts)
- **CSS Modules** для стилизации
- **html-to-image** для экспорта графика в PNG

---

## Data

Источник данных — файл [`src/data.json`](./src/data.json).

Для каждой даты содержатся поля:

- `date` — дата (формат `YYYY-MM-DD`)
- `visits` — количество визитов по вариациям
- `conversions` — количество конверсий по вариациям

Конверсия считается как:

```ts
conversionRate = (conversions / visits) * 100;
В графике все значения отображаются в процентах.

Реализованные фичи
Основные требования
График conversion rate для всех вариаций.

Отображение всех значений в процентах.

Tooltip при наведении:

Вертикальный курсор

Попап с датой DD/MM/YYYY и значениями по каждой вариации

Цветовая привязка к линиям графика

Selector вариаций:

Можно включать/выключать отдельные линии

Гарантируется, что всегда выбрана минимум одна вариация

Day / Week selector:

Переключение агрегации данных (по дням / по неделям)

Адаптивность:

Верстка корректно работает в диапазоне от ~670 px до 1300 px

Бонусные фичи
Line style selector
Выпадающий селект с выбором стиля линии:

line

smooth (monotone)

area (залитая область под линией)

Light / Dark theme
Переключение темы:

Светлая: светлый фон, тёмный текст

Тёмная: тёмный фон, светлый текст

Цвета осей, сетки и tooltip-ов адаптируются под тему

Export chart to PNG
Кнопка Export PNG:

Экспортирует текущий вид графика (с учётом темы, выбранных вариаций и стиля линии)

Используется библиотека html-to-image

Примечание: Zoom / Reset zoom через brush в графике можно добавить при необходимости, но в текущей версии он отключён, чтобы упростить UX и сделать интерфейс ближе к макету.

Локальный запуск
Требования
Node.js >= 20.19 (Vite ругается на более старые версии 20.x)

npm

Установка и запуск
bash
Копировать код
# клонировать репозиторий
git clone git@github.com:YOUR_GITHUB_USERNAME/kameleoon_test_task_r_d.git
cd kameleoon_test_task_r_d

# установить зависимости
npm install

# запустить dev-сервер
npm run dev
После запуска:

Dev-сервер будет доступен по адресу, который покажет Vite, обычно что-то вроде:

http://localhost:5173/

или http://localhost:5173/kameleoon_test_task_r_d/ (если указан base)

Сборка и деплой
Сборка
bash
Копировать код
npm run build
Результат попадёт в папку dist.

Деплой на GitHub Pages
bash
Копировать код
npm run deploy
Скрипт:

Соберёт проект через vite build

Опубликует содержимое папки dist в ветку gh-pages

После этого:

Зайти в Settings → Pages в репозитории.

Выбрать:

Source: Deploy from a branch

Branch: gh-pages

Folder: / (root)

Сохранить.

Страница будет доступна по адресу:

text
Копировать код
https://YOUR_GITHUB_USERNAME.github.io/kameleoon_test_task_r_d/
Дизайн и UI
Темы: светлая / тёмная (на уровне CSS-переменных).

Селекты (Variations, Day/Week, Line style) реализованы кастомными dropdown-компонентами с плавной стрелочкой.

График и все панели используют:

border-radius: 4px

border: 1px solid #c7c5d0 (адаптируется на тёмной теме)

Tooltip:

Календарик перед датой

Значения отсортированы по убыванию конверсии

Для лучшего чтения использованы моноширинные цифры (tabular-nums)

Выбранная библиотека визуализации
Используется библиотека Recharts:

ComposedChart + Line + Area

ResponsiveContainer для адаптивности

Tooltip, CartesianGrid, XAxis, YAxis для построения графика