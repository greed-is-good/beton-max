import { useMemo, useState } from "react";

type Role = "driver" | "manager" | "foreman";
type Scenario = "gps" | "no_gps" | "early";
type RideStatus =
  | "Новая заявка"
  | "В пути"
  | "Прибыл на место"
  | "Выгрузка"
  | "Простой"
  | "Завершено";
type Source =
  | "1С"
  | "Fort Monitor"
  | "Водитель"
  | "Система"
  | "1С / Fort Monitor";

type ActionId =
  | "driver_arrived"
  | "driver_arrival_yes"
  | "driver_arrival_no"
  | "driver_unload_start"
  | "driver_unload_finish"
  | "contact_foreman"
  | "contact_manager"
  | "contact_driver";

type ActionButton = {
  id: string;
  label: string;
  action: ActionId;
  variant?: "primary" | "ghost";
};

type Message = {
  id: string;
  author: "bot" | "system" | "user";
  text: string;
  time: string;
  actions?: ActionButton[];
};

type LogItem = {
  id: string;
  label: string;
  time: string;
};

const ORDER = {
  number: "12345",
  site: "ЖК Сосновый, ул. Лесная, 10",
  vehicle: "А123ВС 55",
  driver: "Иванов И.И.",
  driverPhone: "+7 999 111 11 11",
  ride: "1",
};

const CONTACTS = {
  manager: {
    name: "Петров П.П.",
    phone: "+7 999 222 22 22",
  },
  foreman: {
    name: "Сидоров С.С.",
    phone: "+7 999 333 33 33",
  },
};

const SCENARIOS: Record<Scenario, string> = {
  gps: "С GPS",
  no_gps: "Без GPS",
  early: "Раннее прибытие",
};

const ETA_INITIAL = "14:20";
const ETA_UPDATED = "14:35";

const roleTitle: Record<Role, string> = {
  driver: "Водитель",
  manager: "Менеджер заказчика",
  foreman: "Прораб",
};

const emptyChats: Record<Role, Message[]> = {
  driver: [],
  manager: [],
  foreman: [],
};

const stamp = () =>
  new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const uuid = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [scenario, setScenario] = useState<Scenario>("gps");
  const [status, setStatus] = useState<RideStatus>("Новая заявка");
  const [eta, setEta] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<Source | "—">("—");
  const [log, setLog] = useState<LogItem[]>([]);
  const [chats, setChats] = useState<Record<Role, Message[]>>(emptyChats);
  const [arrivalPrompted, setArrivalPrompted] = useState(false);
  const [idleStarted, setIdleStarted] = useState(false);

  const stageIndex = useMemo(() => {
    const order: RideStatus[] = [
      "Новая заявка",
      "В пути",
      "Прибыл на место",
      "Выгрузка",
      "Простой",
      "Завершено",
    ];
    return order.indexOf(status);
  }, [status]);

  const pushLog = (label: string) => {
    const item: LogItem = { id: uuid(), label, time: stamp() };
    setLog((prev) => [item, ...prev].slice(0, 6));
  };

  const pushMessage = (role: Role, message: Omit<Message, "id" | "time">) => {
    setChats((prev) => ({
      ...prev,
      [role]: [
        ...prev[role],
        { id: uuid(), time: stamp(), ...message },
      ],
    }));
  };

  const resetDemo = (nextScenario: Scenario = scenario) => {
    setScenario(nextScenario);
    setStatus("Новая заявка");
    setEta(null);
    setLastSource("—");
    setLog([]);
    setChats(emptyChats);
    setArrivalPrompted(false);
    setIdleStarted(false);
  };

  const startTrip = () => {
    setStatus("В пути");
    setEta(ETA_INITIAL);
    setLastSource("1С / Fort Monitor");
    setIdleStarted(false);
    pushLog("Рейс запущен, данные из 1С и Fort Monitor");
    pushMessage("driver", {
      author: "bot",
      text: `🚚 Рейс запущен\nЗаказ: №${ORDER.number}\nОбъект: ${ORDER.site}\nСтатус: В пути\nПлановое прибытие: ${ETA_INITIAL}`,
      actions: [
        { id: uuid(), label: "Я приехал", action: "driver_arrived" },
        {
          id: uuid(),
          label: "Связаться с прорабом",
          action: "contact_foreman",
          variant: "ghost",
        },
        {
          id: uuid(),
          label: "Связаться с менеджером",
          action: "contact_manager",
          variant: "ghost",
        },
      ],
    });
    const managerText = `🚚 По заказу №${ORDER.number} машина выехала\nТС: ${ORDER.vehicle}\nВодитель: ${ORDER.driver}\nСтатус: В пути\nПлановое прибытие: ${ETA_INITIAL}`;
    pushMessage("manager", {
      author: "bot",
      text: managerText,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
    pushMessage("foreman", {
      author: "bot",
      text: managerText,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
  };

  const updateEta = () => {
    setEta(ETA_UPDATED);
    setLastSource("Fort Monitor");
    pushLog(`Fort Monitor обновил ETA до ${ETA_UPDATED}`);
    const text = `🕒 Обновление по заказу №${ORDER.number}\nМашина в пути\nНовое время прибытия: ${ETA_UPDATED}`;
    pushMessage("manager", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
    pushMessage("foreman", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
  };

  const gpsArrival = () => {
    setStatus("Прибыл на место");
    setLastSource("Fort Monitor");
    pushLog("Fort Monitor зафиксировал прибытие");
    pushMessage("driver", {
      author: "bot",
      text: `✅ Вы прибыли на объект\nЗаказ: №${ORDER.number}\nНажмите кнопку, когда начнется выгрузка`,
      actions: [
        { id: uuid(), label: "Выгрузка началась", action: "driver_unload_start" },
        { id: uuid(), label: "Связаться с прорабом", action: "contact_foreman", variant: "ghost" },
        { id: uuid(), label: "Связаться с менеджером", action: "contact_manager", variant: "ghost" },
      ],
    });
    const text = `✅ ТС прибыло на объект\nЗаказ: №${ORDER.number}\nТС: ${ORDER.vehicle}\nВодитель: ${ORDER.driver}\nСтатус: Прибыл на место`;
    pushMessage("manager", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
    pushMessage("foreman", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
  };

  const promptArrival = () => {
    setArrivalPrompted(true);
    setLastSource("Fort Monitor");
    pushLog("GPS недоступен, запрошено подтверждение прибытия");
    pushMessage("driver", {
      author: "bot",
      text: `❓ Вы прибыли на объект по заказу №${ORDER.number}?`,
      actions: [
        { id: uuid(), label: "Да, прибыл", action: "driver_arrival_yes" },
        { id: uuid(), label: "Нет, еще в пути", action: "driver_arrival_no", variant: "ghost" },
      ],
    });
  };

  const confirmArrivalYes = (early = false) => {
    setStatus("Прибыл на место");
    setLastSource("Водитель");
    pushLog(early ? "Водитель подтвердил раннее прибытие" : "Водитель подтвердил прибытие");
    pushMessage("driver", {
      author: "bot",
      text: "✅ Прибытие зафиксировано\nНажмите кнопку, когда начнется выгрузка",
      actions: [
        { id: uuid(), label: "Выгрузка началась", action: "driver_unload_start" },
        { id: uuid(), label: "Связаться с прорабом", action: "contact_foreman", variant: "ghost" },
        { id: uuid(), label: "Связаться с менеджером", action: "contact_manager", variant: "ghost" },
      ],
    });
    const text = early
      ? `⚡ ТС прибыло на объект раньше расчетного времени\nЗаказ: №${ORDER.number}\nСтатус: Прибыл на место`
      : `✅ ТС прибыло на объект\nЗаказ: №${ORDER.number}\nСтатус: Прибыл на место`;
    pushMessage("manager", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
    pushMessage("foreman", {
      author: "bot",
      text,
      actions: [{ id: uuid(), label: "Связаться с водителем", action: "contact_driver" }],
    });
  };

  const confirmArrivalNo = () => {
    setLastSource("Водитель");
    pushLog("Прибытие не подтверждено водителем");
    setArrivalPrompted(false);
    pushMessage("driver", {
      author: "system",
      text: "Статус не изменен. Рейс продолжает движение.",
    });
  };

  const startUnloading = () => {
    setStatus("Выгрузка");
    setLastSource("Водитель");
    setIdleStarted(false);
    pushLog("Водитель подтвердил начало выгрузки");
    pushMessage("driver", {
      author: "bot",
      text: "🧱 Выгрузка началась\nБесплатное время: 60 минут\nПосле этого начнется простой",
      actions: [{ id: uuid(), label: "Выгрузка закончилась", action: "driver_unload_finish" }],
    });
    const text = `🧱 По заказу №${ORDER.number} началась выгрузка\nБесплатное время: 60 минут`;
    pushMessage("manager", { author: "bot", text });
    pushMessage("foreman", { author: "bot", text });
  };

  const startIdle = () => {
    setStatus("Простой");
    setLastSource("Система");
    setIdleStarted(true);
    pushLog("Бесплатное время истекло, начался простой");
    pushMessage("driver", {
      author: "bot",
      text: "⏳ Бесплатное время выгрузки истекло\nНачался простой",
      actions: [{ id: uuid(), label: "Выгрузка закончилась", action: "driver_unload_finish" }],
    });
    const text = `⏳ По заказу №${ORDER.number} начался простой\nСтатус: Простой`;
    pushMessage("manager", { author: "bot", text });
    pushMessage("foreman", { author: "bot", text });
  };

  const finishByDriver = () => {
    setStatus("Завершено");
    setLastSource("Водитель");
    pushLog("Водитель подтвердил окончание выгрузки");
    pushMessage("driver", {
      author: "bot",
      text: `🏁 Выгрузка завершена\nЗаказ: №${ORDER.number}\nСтатус: Завершено`,
    });
    const text = idleStarted
      ? `🏁 По заказу №${ORDER.number} выгрузка завершена\nВыгрузка: 90 минут\nПростой: 30 минут\nСтатус: Завершено`
      : `🏁 По заказу №${ORDER.number} выгрузка завершена\nСтатус: Завершено`;
    pushMessage("manager", { author: "bot", text });
    pushMessage("foreman", { author: "bot", text });
  };

  const finishTrip = () => {
    setStatus("Завершено");
    setLastSource("1С");
    pushLog("Рейс завершен");
    pushMessage("driver", {
      author: "bot",
      text: `🏁 Выгрузка завершена\nЗаказ: №${ORDER.number}\nСтатус: Завершено`,
    });
    const text = idleStarted
      ? `🏁 По заказу №${ORDER.number} выгрузка завершена\nВыгрузка: 90 минут\nПростой: 30 минут\nСтатус: Завершено`
      : `🏁 По заказу №${ORDER.number} выгрузка завершена\nСтатус: Завершено`;
    pushMessage("manager", { author: "bot", text });
    pushMessage("foreman", { author: "bot", text });
  };

  const handleContact = (role: Role, label: string) => {
    pushLog(`Запрос связи: ${label}`);
    if (label === "водитель") {
      pushMessage(role, {
        author: "system",
        text: `Водитель ${ORDER.driver}, ТС ${ORDER.vehicle}, телефон: ${ORDER.driverPhone}`,
      });
      return;
    }
    if (label === "прораб") {
      pushMessage(role, {
        author: "system",
        text: `Прораб ${CONTACTS.foreman.name}, телефон: ${CONTACTS.foreman.phone}`,
      });
      return;
    }
    if (label === "менеджер") {
      pushMessage(role, {
        author: "system",
        text: `Менеджер ${CONTACTS.manager.name}, телефон: ${CONTACTS.manager.phone}`,
      });
      return;
    }
    pushMessage(role, {
      author: "system",
      text: "Запрос на связь отправлен.",
    });
  };

  const handleAction = (action: ActionId, role: Role) => {
    if (action === "contact_foreman") return handleContact(role, "прораб");
    if (action === "contact_manager") return handleContact(role, "менеджер");
    if (action === "contact_driver") return handleContact(role, "водитель");
    if (action === "driver_unload_start") return startUnloading();
    if (action === "driver_unload_finish") return finishByDriver();
    if (action === "driver_arrival_yes") return confirmArrivalYes();
    if (action === "driver_arrival_no") return confirmArrivalNo();
    if (action === "driver_arrived") {
      return confirmArrivalYes(true);
    }
  };

  const scenarioHint = SCENARIOS[scenario];

  return (
    <div className="min-h-screen bg-slatey-50">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-sm font-semibold text-accent-600">MAX-бот</p>
          <h1 className="text-2xl font-semibold text-slatey-900">
            Симулятор рейса доставки бетона
          </h1>
          <p className="text-sm text-slatey-500">
            Один экран, три роли, синхронное поведение
          </p>
        </div>
        <div className="rounded-full border border-slatey-200 bg-white px-4 py-2 text-sm font-semibold text-slatey-700 shadow-sm">
          Сценарий: {scenarioHint}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[360px_1fr]">
        <section className="space-y-5">
          <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slatey-400">
                  Управление сценарием
                </p>
                <h2 className="text-lg font-semibold text-slatey-900">
                  Панель событий
                </h2>
              </div>
              <span className="status-pill">{status}</span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slatey-600">
              <div className="flex items-center justify-between">
                <span>Заказ</span>
                <span className="font-semibold text-slatey-800">
                  №{ORDER.number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>ETA</span>
                <span className="font-semibold text-slatey-800">
                  {eta ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Источник события</span>
                <span className="font-semibold text-slatey-800">
                  {lastSource}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="flex flex-wrap gap-2">
                {(["gps", "no_gps", "early"] as Scenario[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => resetDemo(item)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      scenario === item
                        ? "bg-accent-600 text-white shadow-lift"
                        : "bg-slatey-100 text-slatey-600 hover:bg-slatey-200"
                    }`}
                  >
                    {SCENARIOS[item]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slatey-500">
                Переключение сценария перезапускает демо
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slatey-900">
              Системные события
            </p>
            <div className="mt-3 grid gap-2">
              <ActionButton
                label="Запустить рейс"
                onClick={startTrip}
                disabled={status !== "Новая заявка"}
              />
              <ActionButton
                label="Изменить ETA"
                onClick={updateEta}
                disabled={status !== "В пути"}
              />
              <ActionButton
                label="Зафиксировать прибытие по GPS"
                onClick={gpsArrival}
                disabled={status !== "В пути" || scenario !== "gps"}
              />
              <ActionButton
                label="Сымитировать отсутствие GPS"
                onClick={() => resetDemo("no_gps")}
                disabled={scenario === "no_gps"}
                variant="ghost"
              />
              <ActionButton
                label="Достигнуто ETA (авто-опрос)"
                onClick={promptArrival}
                disabled={status !== "В пути" || scenario !== "no_gps" || arrivalPrompted}
              />
              <ActionButton
                label="Подтвердить раннее прибытие"
                onClick={() => confirmArrivalYes(true)}
                disabled={status !== "В пути" || scenario !== "early"}
              />
              <ActionButton
                label="Начать выгрузку"
                onClick={startUnloading}
                disabled={status !== "Прибыл на место"}
              />
              <ActionButton
                label="Запустить простой"
                onClick={startIdle}
                disabled={status !== "Выгрузка"}
              />
              <ActionButton
                label="Завершить рейс"
                onClick={finishTrip}
                disabled={status === "Завершено" || status === "Новая заявка"}
              />
              <ActionButton label="Сбросить демо" onClick={() => resetDemo()} variant="ghost" />
            </div>
          </div>

          <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slatey-900">Лог событий</p>
            <div className="mt-3 space-y-2 text-xs text-slatey-600">
              {log.length === 0 && (
                <p className="text-slatey-400">Действия появятся здесь</p>
              )}
              {log.map((item) => (
                <div key={item.id} className="rounded-lg bg-slatey-50 px-3 py-2">
                  <div className="font-semibold text-slatey-700">{item.label}</div>
                  <div className="text-[11px] text-slatey-400">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <StatusSummary status={status} eta={eta} lastSource={lastSource} />
          <div className="grid gap-5 lg:grid-cols-3">
            {(["driver", "manager", "foreman"] as Role[]).map((role) => (
              <PhoneMockup
                key={role}
                title={roleTitle[role]}
                status={status}
                messages={chats[role]}
                onAction={(action) => handleAction(action, role)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type StatusSummaryProps = {
  status: RideStatus;
  eta: string | null;
  lastSource: Source | "—";
};

function StatusSummary({ status, eta, lastSource }: StatusSummaryProps) {
  return (
    <div className="rounded-2xl border border-slatey-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slatey-400">
            Статус рейса
          </p>
          <h2 className="text-lg font-semibold text-slatey-900">
            Заказ №{ORDER.number}
          </h2>
        </div>
        <span className="status-pill">{status}</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slatey-600 md:grid-cols-2">
        <SummaryRow label="Рейс" value={ORDER.ride} />
        <SummaryRow label="ТС" value={ORDER.vehicle} />
        <SummaryRow label="Водитель" value={ORDER.driver} />
        <SummaryRow label="ETA" value={eta ?? "—"} />
        <SummaryRow label="Источник события" value={lastSource} />
        <SummaryRow label="Объект" value={ORDER.site} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slatey-50 px-3 py-2">
      <span className="text-xs text-slatey-500">{label}</span>
      <span className="text-sm font-semibold text-slatey-800">{value}</span>
    </div>
  );
}

type PhoneProps = {
  title: string;
  status: RideStatus;
  messages: Message[];
  onAction: (action: ActionId) => void;
};

function PhoneMockup({ title, status, messages, onAction }: PhoneProps) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slatey-700">{title}</div>
      <div className="iphone-frame">
        <div className="iphone-glass">
          <div className="iphone-screen shadow-phone">
            <div className="iphone-notch">
              <div className="iphone-camera" />
              <div className="iphone-speaker" />
            </div>
            <div className="phone-shell">
              <div className="flex flex-col pt-6">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slatey-900">MAX-бот</div>
                      <div className="text-xs text-slatey-500">Рейс №{ORDER.ride}</div>
                    </div>
                    <span className="rounded-full bg-slatey-100 px-3 py-1 text-[11px] font-semibold text-slatey-600">
                      {status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 px-4 pb-4">
                  {messages.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slatey-200 bg-white px-3 py-3 text-xs text-slatey-400">
                      Сообщения появятся после запуска рейса
                    </div>
                  )}
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onAction={onAction}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onAction,
}: {
  message: Message;
  onAction: (action: ActionId) => void;
}) {
  return (
    <div className="fade-in space-y-2">
      <div className={`message-bubble ${message.author} px-3 py-2 text-sm text-slatey-700`}>
        <p className="whitespace-pre-line">{message.text}</p>
        <div className="mt-2 text-[11px] text-slatey-400">{message.time}</div>
      </div>
      {message.actions && (
        <div className="flex flex-wrap gap-2">
          {message.actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction(action.action)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                action.variant === "ghost"
                  ? "border border-slatey-200 bg-white text-slatey-600 hover:border-slatey-300"
                  : "bg-accent-600 text-white shadow-sm hover:bg-accent-700"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
        variant === "ghost"
          ? "border border-slatey-200 bg-white text-slatey-600 hover:bg-slatey-50"
          : "bg-accent-600 text-white hover:bg-accent-700"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {label}
    </button>
  );
}
