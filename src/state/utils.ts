export const stamp = () =>
  new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const uuid = () => Math.random().toString(36).slice(2, 10);
