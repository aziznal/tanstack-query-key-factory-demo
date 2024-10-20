"use client";

import { Keyword } from "@/components/Keyword";
import { DocsLink } from "@/components/Links/DocsLink";
import { ExternalLink } from "@/components/Links/ExternalLink";
import { InternalLink } from "@/components/Links/InternalLink";
import {
  queryClient,
  queryClientConfig,
} from "@/components/QueryClientProvider";
import { Button } from "@/components/ui/button";
import { EventLog, useEventLog } from "@/components/EventLog";
import {
  useAddItemMutation,
  useDeleteItemMutation,
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useGetItemDetailsByIdQuery,
  useUpdateItemDetailsNameMutation,
  useUpdateItemNameMutation,
} from "@/lib/queries";
import { getColorFromWords } from "@/lib/utils";
import { LucideFlame, LucideLoader2, LucideNotebook } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const eventLog = useEventLog();

  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  const getAllItemsTimer = useTimer();
  const getItemByIdTimer = useTimer();
  const getItemDetailsByIdTimer = useTimer();

  const getAllItemsQuery = useGetAllItemsQuery({
    pre: () => {
      eventLog.addEvent({
        name: "Fetched All Items",
        type: "query-fetching",
      });

      getAllItemsTimer.reset();
    },
  });

  const getItemByIdQuery = useGetItemByIdQuery(selectedItemId, {
    pre: () => {
      eventLog.addEvent({
        name: `Get ITEM by id ${selectedItemId} fetched`,
        type: "query-fetching",
      });

      getItemByIdTimer.reset();
    },
  });

  const getItemDetailsByIdQuery = useGetItemDetailsByIdQuery(selectedItemId, {
    pre: () => {
      eventLog.addEvent({
        name: `Get ITEM DETAILS by id ${selectedItemId} fetched`,
        type: "query-fetching",
      });

      getItemDetailsByIdTimer.reset();
    },
  });

  const addItemMutation = useAddItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const updateItemNameMutation = useUpdateItemNameMutation();
  const updateItemDetailsNameMutation = useUpdateItemDetailsNameMutation();

  const isLoading =
    getAllItemsQuery.isLoading ||
    getItemByIdQuery.isLoading ||
    getItemDetailsByIdQuery.isLoading ||
    addItemMutation.isPending ||
    deleteItemMutation.isPending ||
    updateItemNameMutation.isPending ||
    updateItemDetailsNameMutation.isPending;

  const isRefetching =
    getAllItemsQuery.isRefetching ||
    getItemByIdQuery.isRefetching ||
    getItemDetailsByIdQuery.isRefetching;

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] mx-4 py-12">
      <ExternalLink
        href="https://tanstack.com/query/latest"
        className="font-bold text-lg mb-2"
        title="The official site for the tanstack query"
      >
        Tanstack Query
      </ExternalLink>

      <h1 className="text-2xl font-bold mb-2">Key Factory Demo</h1>

      <div className="flex gap-4 items-center text-xs mb-4">
        <DocsLink
          href="https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
          title="The official docs for query keys"
        >
          query keys
        </DocsLink>

        <DocsLink
          href="https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories"
          title="Effective usage of query keys by the creator of the library himself"
        >
          key factories
        </DocsLink>

        <DocsLink
          href="https://github.com/lukemorales/query-key-factory"
          title="A community package for query key factories"
        >
          community package
        </DocsLink>
      </div>

      <div className="mb-8 text-center max-w-[500px] text-sm text-zinc-500">
        In this demo, I demonstrate how key factories work for{" "}
        <Keyword>creating</Keyword>, <Keyword>updating</Keyword>,{" "}
        <Keyword>deleting</Keyword>, and <Keyword>invalidating</Keyword> queries
        and query data.
      </div>

      <div className="flex mb-4 gap-2">
        <Button
          size="xs"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: [],
            });
          }}
        >
          Invalidate All Queries{" "}
          <LucideFlame size="20" className="text-amber-700" />
        </Button>

        {isLoading && <LucideLoader2 className="animate-spin" />}

        {isRefetching && (
          <>
            Refetching ... <LucideLoader2 className="animate-spin" />
          </>
        )}
      </div>

      <div className="flex gap-3 flex-wrap mb-12">
        <ItemsList
          items={getAllItemsQuery.data ?? []}
          isRefetching={getAllItemsQuery.isRefetching}
          onItemSelected={setSelectedItemId}
          timer={getAllItemsTimer.timer}
        />

        <div className="flex flex-col border p-3 rounded-sm w-[250px]">
          <h3 className="font-bold mb-4">Current Item</h3>

          <RefetchProgressBar
            timerMs={getItemByIdQuery.data ? getItemByIdTimer.timer : 0}
          />

          {getItemByIdQuery.isSuccess && (
            <div className="flex flex-col">
              <span className="text-zinc-500 text-sm italic">
                #{getItemByIdQuery.data?.id}
              </span>

              <span>{getItemByIdQuery.data?.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col border p-3 rounded-sm w-[250px]">
          <h3 className="font-bold">Current Item Details</h3>
        </div>
      </div>

      <EventLog className="mb-4" />

      <InternalLink
        className="flex items-center gap-1 text-zinc-500 text-xs"
        href="/notes"
      >
        <LucideNotebook size="16" />
        Notes
      </InternalLink>
    </div>
  );
}

const useTimer = (start?: number) => {
  const [timer, setTimer] = useState(start ?? queryClientConfig.staleTimeMs);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t - 100), 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    timer,
    timerSeconds: timer / 1000,
    reset: (resetTo?: number) =>
      setTimer(resetTo ?? start ?? queryClientConfig.staleTimeMs),
  };
};

type ItemsListProps = {
  items: { id: string; name: string }[];
  isRefetching: boolean;
  onItemSelected: (itemId: string) => void;
  timer: number;
};

function ItemsList({
  items,
  onItemSelected,
  isRefetching,
  timer,
}: ItemsListProps) {
  return (
    <div className="p-4 rounded-sm w-[250px] outline-orange-700 outline-1 hover:outline">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Items</h3>

        {isRefetching && (
          <span className="text-zinc-500 text-xs flex gap-1 items-center">
            refetching{" "}
            <LucideLoader2 className="animate-spin text-orange-500" size="16" />
          </span>
        )}
      </div>

      <div>
        <RefetchProgressBar timerMs={timer} />

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-3 border rounded hover:bg-zinc-800 cursor-pointer"
              style={{ borderColor: getColorFromWords(item.name) }}
              onClick={() => onItemSelected(item.id)}
            >
              <span className="text-xs text-zinc-500 italic">#{item.id}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type RefetchProgressBarProps = {
  timerMs: number;
};

function RefetchProgressBar({ timerMs }: RefetchProgressBarProps) {
  return (
    <>
      <span className="text-sm text-zinc-500 mb-2">
        {Math.max(timerMs / 1000, 0).toFixed(1)} seconds until stale
      </span>

      <div className="w-full mb-4 border rounded overflow-clip">
        <div
          className="h-[10px] bg-purple-600"
          style={{
            width: `${(timerMs / queryClientConfig.staleTimeMs) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
