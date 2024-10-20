import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export function getLoggedEventTypes() {
  return [
    "document-visibility-visible",
    "document-visibility-hidden",
    "manual-invalidation",
    "data-went-stale",
    "query-fetching",
  ] as const;
}

export type LoggedEvent = {
  id: string;
  name: string;
  content?: string;
  date: Date;
  type?: ReturnType<typeof getLoggedEventTypes>[number];
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
      name: "event-log-filter-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface EventLogFilterState {
  includedEventTypes: LoggedEvent["type"][];

  setIncludedEventTypes: (eventTypes: LoggedEvent["type"][]) => void;

  addEventType: (eventType: LoggedEvent["type"]) => void;

  removeEventType: (eventType: LoggedEvent["type"]) => void;
}

export const useEventLogFilterStore = create<EventLogFilterState>()(
  persist(
    (set, get) => ({
      includedEventTypes: [],

      setIncludedEventTypes: (eventTypes) =>
        set({ includedEventTypes: eventTypes }),

      addEventType: (eventType) =>
        set({ includedEventTypes: [...get().includedEventTypes, eventType] }),

      removeEventType: (eventType) =>
        set({
          includedEventTypes: get().includedEventTypes.filter(
            (e) => e !== eventType,
          ),
        }),
    }),
    {
      name: "event-log-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
