import type { RideStatus, Source } from "../data/constants";
import { ORDER } from "../data/constants";

type Props = {
  status: RideStatus;
  eta: string | null;
  lastSource: Source | "—";
};

export default function StatusSummary({ status, eta, lastSource }: Props) {
  return (
    <div className="rounded-2xl border border-slatey-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slatey-400">Статус рейса</p>
          <h2 className="text-lg font-semibold text-slatey-900">Заказ №{ORDER.number}</h2>
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
