export type Role = "driver" | "manager" | "foreman";
export type Scenario = "gps" | "no_gps" | "early";
export type RideStatus =
  | "Новая заявка"
  | "В пути"
  | "Прибыл на место"
  | "Выгрузка"
  | "Простой"
  | "Завершено";

export type Source =
  | "1С"
  | "Fort Monitor"
  | "Водитель"
  | "Система"
  | "1С / Fort Monitor";

export const ORDER = {
  number: "12345",
  site: "ЖК Сосновый, ул. Лесная, 10",
  vehicle: "А123ВС 55",
  driver: "Иванов И.И.",
  driverPhone: "+7 999 111 11 11",
  ride: "1",
};

export const CONTACTS = {
  manager: {
    name: "Петров П.П.",
    phone: "+7 999 222 22 22",
  },
  foreman: {
    name: "Сидоров С.С.",
    phone: "+7 999 333 33 33",
  },
};

export const SCENARIOS: Record<Scenario, string> = {
  gps: "С GPS",
  no_gps: "Без GPS",
  early: "Раннее прибытие",
};

export const ETA_INITIAL = "14:20";
export const ETA_UPDATED = "14:35";

export const roleTitle: Record<Role, string> = {
  driver: "Водитель",
  manager: "Менеджер заказчика",
  foreman: "Прораб",
};
