import type { ActionButton as ActionButtonType, Message } from "../data/types";

type Props = {
  message: Message;
  onAction: (action: ActionButtonType["action"]) => void;
};

export default function MessageBubble({ message, onAction }: Props) {
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
