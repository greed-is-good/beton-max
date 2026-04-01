import type { Scenario, RideStatus, Source } from "../data/constants";
import { SCENARIOS, ORDER } from "../data/constants";
import ActionButton from "./ActionButton";
import EventLog from "./EventLog";
import type { LogItem } from "../data/types";

type Props = {
  status: RideStatus;
  eta: string | null;
  lastSource: Source | "—";
  scenario: Scenario;
  log: LogItem[];
  arrivalPrompted: boolean;
  onScenarioChange: (scenario: Scenario) => void;
  onStartTrip: () => void;
  onUpdateEta: () => void;
  onGpsArrival: () => void;
  onPromptArrival: () => void;
  onConfirmEarlyArrival: () => void;
  onStartUnloading: () => void;
  onStartIdle: () => void;
  onFinishTrip: () => void;
  onReset: () => void;
};

export default function ControlPanel({
  status,
  eta,
  lastSource,
  scenario,
  log,
  arrivalPrompted,
  onScenarioChange,
  onStartTrip,
  onUpdateEta,
  onGpsArrival,
  onPromptArrival,
  onConfirmEarlyArrival,
  onStartUnloading,
  onStartIdle,
  onFinishTrip,
  onReset,
}: Props) {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slatey-400">
              Управление сценарием
            </p>
            <h2 className="text-lg font-semibold text-slatey-900">Панель событий</h2>
          </div>
          <span className="status-pill">{status}</span>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slatey-600">
          <div className="flex items-center justify-between">
            <span>Заказ</span>
            <span className="font-semibold text-slatey-800">№{ORDER.number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>ETA</span>
            <span className="font-semibold text-slatey-800">{eta ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Источник события</span>
            <span className="font-semibold text-slatey-800">{lastSource}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SCENARIOS) as Scenario[]).map((item) => (
              <button
                key={item}
                onClick={() => onScenarioChange(item)}
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
          <p className="text-xs text-slatey-500">Переключение сценария перезапускает демо</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slatey-900">Системные события</p>
        <div className="mt-3 grid gap-2">
          <ActionButton label="Запустить рейс" onClick={onStartTrip} disabled={status !== "Новая заявка"} />
          <ActionButton label="Изменить ETA" onClick={onUpdateEta} disabled={status !== "В пути"} />
          <ActionButton
            label="Зафиксировать прибытие по GPS"
            onClick={onGpsArrival}
            disabled={status !== "В пути" || scenario !== "gps"}
          />
          <ActionButton
            label="Сымитировать отсутствие GPS"
            onClick={() => onScenarioChange("no_gps")}
            disabled={scenario === "no_gps"}
            variant="ghost"
          />
          <ActionButton
            label="Достигнуто ETA (авто-опрос)"
            onClick={onPromptArrival}
            disabled={status !== "В пути" || scenario !== "no_gps" || arrivalPrompted}
          />
          <ActionButton
            label="Подтвердить раннее прибытие"
            onClick={onConfirmEarlyArrival}
            disabled={status !== "В пути" || scenario !== "early"}
          />
          <ActionButton label="Начать выгрузку" onClick={onStartUnloading} disabled={status !== "Прибыл на место"} />
          <ActionButton label="Запустить простой" onClick={onStartIdle} disabled={status !== "Выгрузка"} />
          <ActionButton
            label="Завершить рейс"
            onClick={onFinishTrip}
            disabled={status === "Завершено" || status === "Новая заявка"}
          />
          <ActionButton label="Сбросить демо" onClick={onReset} variant="ghost" />
        </div>
      </div>

      <EventLog log={log} />
    </section>
  );
}
