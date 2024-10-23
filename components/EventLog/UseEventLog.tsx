import { generateRandomId } from "@/lib/utils";
import {
  getLoggedEventTypes,
  LoggedEvent,
  useEventLogFilterStore,
  useEventLogStore,
} from "./EventLogStore";
import { useCallback } from "react";

function createEvent({
  name,
  content,
  date,
  type,
}: {
  name: string;
  content?: LoggedEvent["content"];
  date?: Date;
  type?: LoggedEvent["type"];
}): LoggedEvent {
  return {
    id: generateRandomId(),
    name,
    content,
    date: date ?? new Date(),
    type,
  };
}

export function useEventLog() {
  const store = useEventLogStore();

  const addEvent = useCallback(
    (...newEvent: Parameters<typeof createEvent>) => {
      return store.addEvent(createEvent(...newEvent));
    },
    [store],
  );

  const removeEvent = useCallback(
    (eventId: LoggedEvent["id"]) => {
      store.setEvents(store.events.filter((event) => event.id !== eventId));
    },
    [store],
  );

  const clearEvents = useCallback(() => {
    return store.setEvents([]);
  }, [store]);

  return {
    events: store.events,
    addEvent,
    removeEvent,
    clearEvents,
  };
}

export function useEventLogFilter() {
  const store = useEventLogFilterStore();

  const toggleEventType = useCallback(
    (eventType: LoggedEvent["type"]) => {
      return store.includedEventTypes.includes(eventType)
        ? store.removeEventType(eventType)
        : store.addEventType(eventType);
    },
    [store],
  );

  const clearFilters = useCallback(() => {
    return store.setIncludedEventTypes([...getLoggedEventTypes()]);
  }, [store]);

  return {
    eventTypes: store.includedEventTypes,
    toggleEventType,
    clearFilters,
  };
}
