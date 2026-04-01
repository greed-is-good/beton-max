import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PhoneMockup from "./components/PhoneMockup";
import StatusSummary from "./components/StatusSummary";
import {
  CONTACTS,
  ETA_INITIAL,
  ETA_UPDATED,
  ORDER,
  SCENARIOS,
  roleTitle,
  type RideStatus,
  type Scenario,
  type Source,
  type Role,
} from "./data/constants";
import type { ActionId, ChatMap, LogItem, Message } from "./data/types";
import { stamp, uuid } from "./state/utils";

const emptyChats: ChatMap = {
  driver: [],
  manager: [],
  foreman: [],
};

export default function App() {
  const [scenario, setScenario] = useState<Scenario>("gps");
  const [status, setStatus] = useState<RideStatus>("Новая заявка");
  const [eta, setEta] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<Source | "—">("—");
  const [log, setLog] = useState<LogItem[]>([]);
  const [chats, setChats] = useState<ChatMap>(emptyChats);
  const [arrivalPrompted, setArrivalPrompted] = useState(false);
  const [idleStarted, setIdleStarted] = useState(false);

  const pushLog = (label: string) => {
    const item: LogItem = { id: uuid(), label, time: stamp() };
    setLog((prev) => [item, ...prev].slice(0, 6));
  };

  const pushMessage = (role: Role, message: Omit<Message, "id" | "time">) => {
    setChats((prev) => ({
      ...prev,
      [role]: [...prev[role], { id: uuid(), time: stamp(), ...message }],
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
        text: `Водитель ${ORDER.driver}\nТС: ${ORDER.vehicle}\n📞 ${ORDER.driverPhone}`,
      });
      return;
    }
    if (label === "прораб") {
      pushMessage(role, {
        author: "system",
        text: `Прораб ${CONTACTS.foreman.name}\n📞 ${CONTACTS.foreman.phone}`,
      });
      return;
    }
    if (label === "менеджер") {
      pushMessage(role, {
        author: "system",
        text: `Менеджер ${CONTACTS.manager.name}\n📞 ${CONTACTS.manager.phone}`,
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
    if (action === "driver_arrived") return confirmArrivalYes(true);
  };

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
          Сценарий: {SCENARIOS[scenario]}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[360px_1fr]">
        <ControlPanel
          status={status}
          eta={eta}
          lastSource={lastSource}
          scenario={scenario}
          log={log}
          arrivalPrompted={arrivalPrompted}
          onScenarioChange={(next) => resetDemo(next)}
          onStartTrip={startTrip}
          onUpdateEta={updateEta}
          onGpsArrival={gpsArrival}
          onPromptArrival={promptArrival}
          onConfirmEarlyArrival={() => confirmArrivalYes(true)}
          onStartUnloading={startUnloading}
          onStartIdle={startIdle}
          onFinishTrip={finishTrip}
          onReset={() => resetDemo()}
        />

        <section className="space-y-6">
          <StatusSummary status={status} eta={eta} lastSource={lastSource} />
          <div className="grid gap-5 lg:grid-cols-3">
            {(Object.keys(roleTitle) as Role[]).map((role) => (
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
