import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LoggedEvent = {
  id: string;
  name: string;
  content: string;
  date: Date;
  type?:
    | "document-visibility-visible"
    | "document-visibility-hidden"
    | "manual-invalidation"
    | "data-went-stale";
};

interface EventLogState {
  events: LoggedEvent[];
  addEvent: (newEvent: LoggedEvent) => void;
  setEvents: (newEvents: LoggedEvent[]) => void;
}

export const useEventLogStore = create<EventLogState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (newEvent) => set({ events: [...get().events, newEvent] }),
      setEvents: (events) => set({ events: events }),
    }),
    {
      name: "event-log-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
