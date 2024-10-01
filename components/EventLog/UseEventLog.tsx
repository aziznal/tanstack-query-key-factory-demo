import { generateRandomId } from "@/lib/utils";
import { LoggedEvent, useEventLogStore } from "./EventLogStore";

function createEvent({
  name,
  content,
  date,
  type,
}: {
  name: string;
  content: LoggedEvent["content"];
  date: Date;
  type?: LoggedEvent["type"];
}): LoggedEvent {
  return {
    id: generateRandomId(),
    name,
    content,
    date,
    type,
  };
}

export function useEventLog() {
  const store = useEventLogStore();

  const addEvent = (...newEvent: Parameters<typeof createEvent>) => {
    return store.addEvent(createEvent(...newEvent));
  };

  const clearEvents = () => {
    return store.setEvents([]);
  };

  return {
    events: store.events,
    addEvent,
    clearEvents,
  };
}
