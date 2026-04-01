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

export default function PhoneMockup({ title, status, messages, onAction }: PhoneProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slatey-200 bg-white px-4 py-2 text-base font-semibold uppercase tracking-wide text-slatey-700 shadow-sm">
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
