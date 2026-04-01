import { useEffect, useRef } from "react";
import type { ActionId, Message } from "../data/types";
import type { RideStatus } from "../data/constants";
import { ORDER } from "../data/constants";
import MessageBubble from "./MessageBubble";

type PhoneProps = {
  title: string;
  status: RideStatus;
  messages: Message[];
  onAction: (action: ActionId) => void;
};

const roleIcon: Record<string, JSX.Element> = {
  "Водитель": (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 4.2v5.1M19.8 12h-5.1M12 19.8v-5.1M4.2 12h5.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  "Менеджер заказчика": (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 8.5h16a1.5 1.5 0 0 1 1.5 1.5v7a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-7A1.5 1.5 0 0 1 4 8.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8.5V7a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M2.5 12.2h19" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  "Прораб": (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 11.5h16v4.2a3.3 3.3 0 0 1-3.3 3.3H7.3A3.3 3.3 0 0 1 4 15.7v-4.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.2 11.5V9.2a5.8 5.8 0 0 1 11.6 0v2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M12 4.2v4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export default function PhoneMockup({ title, status, messages, onAction }: PhoneProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slatey-200 bg-white px-4 py-2 text-base font-semibold text-slatey-700 shadow-sm">
        <span className="text-slatey-500">{roleIcon[title]}</span>
        {title}
      </div>
      <div className="iphone-frame">
        <div className="iphone-glass">
          <div className="iphone-screen shadow-phone">
            <div className="iphone-notch">
              <div className="iphone-camera" />
              <div className="iphone-speaker" />
            </div>
            <div className="phone-shell">
              <div className="flex h-full flex-col pt-6">
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
                <div className="chat-scroll space-y-3 px-4 pb-4" ref={scrollRef}>
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
