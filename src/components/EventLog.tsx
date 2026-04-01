import type { LogItem } from "../data/types";

type Props = {
  log: LogItem[];
};

export default function EventLog({ log }: Props) {
  return (
    <div className="rounded-2xl border border-slatey-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slatey-900">Лог событий</p>
      <div className="mt-3 space-y-2 text-xs text-slatey-600">
        {log.length === 0 && <p className="text-slatey-400">Действия появятся здесь</p>}
        {log.map((item) => (
          <div key={item.id} className="rounded-lg bg-slatey-50 px-3 py-2">
            <div className="font-semibold text-slatey-700">{item.label}</div>
            <div className="text-[11px] text-slatey-400">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
