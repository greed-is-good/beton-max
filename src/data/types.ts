import type { Role } from "./constants";

export type ActionId =
  | "driver_arrived"
  | "driver_arrival_yes"
  | "driver_arrival_no"
  | "driver_unload_start"
  | "driver_unload_finish"
  | "contact_foreman"
  | "contact_manager"
  | "contact_driver";

export type ActionButton = {
  id: string;
  label: string;
  action: ActionId;
  variant?: "primary" | "ghost";
};

export type Message = {
  id: string;
  author: "bot" | "system" | "user";
  text: string;
  time: string;
  actions?: ActionButton[];
};

export type LogItem = {
  id: string;
  label: string;
  time: string;
};

export type ChatMap = Record<Role, Message[]>;
