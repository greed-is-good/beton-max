# beton-max

Интерактивный фронтенд-прототип MAX-бота сопровождения доставки бетона. Проект задуман как база для дальнейших моков и презентаций.

## Быстрый старт

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

## GitHub Pages (публикация)

Мы используем папку `docs/`, чтобы не смешивать исходники и билд.

Шаги:
1. Выполнить `npm run build:pages` — билды окажутся в `docs/`.
2. В GitHub: Settings → Pages → Source = Deploy from a branch.
3. Branch = `master`, Folder = `/docs`, Save.

После этого сайт будет доступен по адресу:
`https://greed-is-good.github.io/beton-max/`

## Архитектура и структура

```
src/
  App.tsx                # Сценарий демо: state, события, синхронизация чатов
  main.tsx               # Точка входа
  styles.css             # Глобальные стили + стили мокапов телефонов
  components/            # UI-компоненты
    ActionButton.tsx     # Кнопка панели управления
    ControlPanel.tsx     # Панель сценария + лог
    EventLog.tsx         # Лента событий
    MessageBubble.tsx    # Сообщение чата + CTA
    PhoneMockup.tsx      # Мокап телефона + автоскролл чата
    StatusSummary.tsx    # Сводка рейса
  data/
    constants.ts         # Роли, статусы, сценарии, мок-данные
    types.ts             # Типы сообщений, логов, действий
  state/
    utils.ts             # Временные метки, id
```

## Где менять поведение

Основная логика живет в `src/App.tsx`:

- Состояния рейса: `status`, `eta`, `lastSource`, `scenario`, `arrivalPrompted`, `idleStarted`.
- События сценария: `startTrip`, `updateEta`, `gpsArrival`, `promptArrival`, `confirmArrivalYes/No`,
  `startUnloading`, `startIdle`, `finishByDriver`, `finishTrip`.
- Синхронные сообщения во все чаты: `pushMessage`.
- Лог событий: `pushLog`.

Если нужно переиспользовать демо под новый кейс:
1. Обнови `src/data/constants.ts` (названия ролей, мок-данные заказа, сценарии).
2. Подстрой тексты в обработчиках событий в `src/App.tsx`.
3. При необходимости добавь новые события и кнопки в `components/ControlPanel.tsx`.

## Где менять контент

- Мок-данные (заказ, водитель, телефоны): `src/data/constants.ts`.
- Сценарии и их названия: `src/data/constants.ts`.
- Тексты сообщений: `src/App.tsx` в соответствующих событиях.

## Где менять UI

- Телефоны и автоскролл: `src/components/PhoneMockup.tsx`, стили в `src/styles.css`.
- Кнопки сообщений: `src/components/MessageBubble.tsx`.
- Панель управления: `src/components/ControlPanel.tsx`.
- Блок статуса: `src/components/StatusSummary.tsx`.

## Принципы демо

- Только фронтенд, без API и бекенда.
- Один рейс, три роли: водитель, менеджер, прораб.
- Все действия синхронно обновляют статус, чаты и лог.
