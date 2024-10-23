"use client";

import { cn } from "@/lib/utils";
import { useEventLog, useEventLogFilter } from "./UseEventLog";
import {
  LucideCircleArrowDown,
  LucideEye,
  LucideEyeOff,
  LucideFilter,
  LucideRotateCw,
  LucideTrash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { getLoggedEventTypes, LoggedEvent } from "./EventLogStore";
import { IconButton } from "../ui/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type EventLogProps = {
  className?: string;
};

export function EventLog({ className }: EventLogProps) {
  const { events, addEvent, clearEvents } = useEventLog();

  const filter = useEventLogFilter();

  const [currentFocusedEventId, setCurrentFocusedEventId] = useState<
    LoggedEvent["id"] | undefined
  >(undefined);

  useEffect(() => {
    const handle = () => {
      addEvent({
        name:
          document.visibilityState === "hidden"
            ? "Document Hidden"
            : "Document Visible",
        date: new Date(),
        type:
          document.visibilityState === "hidden"
            ? "document-visibility-hidden"
            : "document-visibility-visible",
      });
    };

    document.addEventListener("visibilitychange", handle);

    return () => {
      document.removeEventListener("visibilitychange", handle);
    };
  }, [addEvent]);

  useEffect(() => {
    if (events.length === 0) setCurrentFocusedEventId(undefined);
  }, [events]);

  return (
    <div
      className={cn("p-4 border rounded-lg max-w-[500px] w-full ", className)}
    >
      <div className="flex justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">Event Log</h3>

          <IconButton onClick={clearEvents}>
            <LucideTrash2 size="20" />
          </IconButton>
        </div>

        <EventFilter />
      </div>

      <div className="flex flex-col h-[500px] overflow-y-auto gap-3">
        {events
          .toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .filter((event) => filter.eventTypes.includes(event.type))
          .map((event) => (
            <div
              key={event.id}
              className={cn(
                "flex items-start gap-2 text-xs rounded hover:bg-zinc-800 p-2",
                currentFocusedEventId === event.id && "bg-zinc-800",
              )}
              onMouseEnter={() => setCurrentFocusedEventId(event.id)}
            >
              <div className="mt-0.5 text-zinc-500">
                {event.type === "document-visibility-visible" && (
                  <LucideEye className="text-yellow-400" />
                )}
                {event.type === "document-visibility-hidden" && (
                  <LucideEyeOff />
                )}

                {event.type === "query-fetching" && (
                  <LucideCircleArrowDown className="text-green-400" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold">{event.name}</span>

                {event.content && <span>{event.content}</span>}

                <span className="text-zinc-400 italic">
                  {dayjs(event.date).format("HH:mm:ss:SSS")}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const EventFilter: React.FC = () => {
  const filter = useEventLogFilter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton className="relative">
          <LucideFilter size="20" />

          {filter.eventTypes.length !== 0 && (
            <div className="flex items-center justify-center rounded-full h-[16px] w-[16px] shrink-0 leading-none text-xs absolute top-0 right-0 bg-zinc-700">
              {filter.eventTypes.length}
            </div>
          )}
        </IconButton>
      </PopoverTrigger>

      <PopoverContent align="end">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Event Filter</h2>

            <IconButton onClick={filter.clearFilters}>
              <LucideRotateCw size="20"/>
            </IconButton>
          </div>

          <p className="text-sm text-zinc-500 mb-4">
            Select which types of events to include. Selecting no events will
            disable the filter.
          </p>

          <div className="flex flex-col gap-3">
            {getLoggedEventTypes().map((eventType) => (
              <div
                key={`event-type-filter-${eventType}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id={`event-type-filter-id-${eventType}`}
                  className="cursor-pointer"
                  type="checkbox"
                  checked={filter.eventTypes.includes(eventType)}
                  onChange={() => {
                    filter.toggleEventType(eventType);
                  }}
                />

                <label
                  htmlFor={`event-type-filter-id-${eventType}`}
                  className="cursor-pointer"
                >
                  <pre className="text-sm">{eventType}</pre>
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
