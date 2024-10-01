"use client";

import { cn } from "@/lib/utils";
import { useEventLog } from "./UseEventLog";
import { LucideEye, LucideEyeOff, LucideTrash2 } from "lucide-react";
import { useEffect, useState } from "react";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { LoggedEvent } from "./EventLogStore";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type EventLogProps = {
  className?: string;
};

export function EventLog({ className }: EventLogProps) {
  const { events, addEvent, clearEvents } = useEventLog();
  const [currentFocusedEventId, setCurrentFocusedEventId] = useState<
    LoggedEvent["id"] | undefined
  >(undefined);

  useEffect(() => {
    const handle = () => {
      addEvent({
        name: "Document Visibility Changed",
        date: new Date(Date.now()),
        content: `Document visibility changed to ${document.visibilityState}`,
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
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold">Event Log</h3>

        <LucideTrash2
          size="20"
          className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
          onClick={clearEvents}
        />
      </div>

      <div className="flex flex-col h-[500px] overflow-y-auto gap-3">
        {events
          .toSorted((a, b) => (a.date > b.date ? -1 : 1))
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
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold">{event.name}</span>

                <span>{event.content}</span>

                <span className="text-zinc-400 italic">
                  {dayjs(event.date).fromNow()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
