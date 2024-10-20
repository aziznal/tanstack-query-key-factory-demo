import { queryClient } from "@/components/QueryClientProvider";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { generate as generateRandomWords } from "random-words";
import { generateRandomId } from "./utils";

export const itemsKeyFactory = {
  all: "all" as const,

  items: () => [itemsKeyFactory.all, "items"] as const,

  item: (itemId: string) =>
    [...itemsKeyFactory.items(), "item", itemId] as const,

  itemDetails: (itemId: string) =>
    [...itemsKeyFactory.item(itemId), "item-details"] as const,
};

type Item = {
  id: string;
  name: string;
  details: ItemDetails;
};

type ItemWithoutDetails = Omit<Item, "details">;

type ItemDetails = {
  id: string;
  name: string;
};

export const generateItem = (): Item => {
  return {
    id: generateRandomId(),
    name: generateRandomWords({ exactly: 3, join: " " }),
    details: generateItemDetails(),
  };
};

const generateItemDetails = (): ItemDetails => {
  return {
    id: generateRandomId(),
    name: generateRandomWords({ exactly: 8, join: " " }),
  };
};

const sleep = async (seconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

let currentItems: Item[] = [];

export const fetchAllItems = async (): Promise<ItemWithoutDetails[]> => {
  await sleep(3);

  currentItems = Array(3)
    .fill(0)
    .map(() => generateItem());

  return currentItems;
};

export const fetchItem = async (
  itemId: Item["id"],
): Promise<ItemWithoutDetails | undefined> => {
  await sleep(3);

  return currentItems.find((item) => item.id === itemId);
};

export const fetchItemDetails = async (itemId: Item["id"]) => {
  await sleep(3);

  return currentItems.find((item) => item.id === itemId)?.details;
};

export const addItem = async () => {
  await sleep(3);

  const newItem = generateItem();

  currentItems.push(newItem);
};

export const updateItemName = async ({
  itemId,
  newName,
}: {
  itemId: Item["id"];
  newName: Item["name"];
}) => {
  await sleep(3);

  currentItems = currentItems.map((item) => {
    if (item.id === itemId)
      return {
        ...item,
        name: newName,
      };

    return item;
  });
};

export const updateItemDetailsName = async ({
  itemId,
  newName,
}: {
  itemId: Item["id"];
  newName: ItemDetails["name"];
}) => {
  currentItems = currentItems.map((item) => {
    if (item.id === itemId)
      return {
        ...item,
        details: {
          ...item.details,
          name: newName,
        },
      };

    return item;
  });
};

export const deleteItem = async (itemId: Item["id"]) => {
  currentItems = currentItems.filter((item) => item.id !== itemId);
};

type UseQueryOptionsWithCallbacks<T> = {
  /** function to run before the query */
  pre?: () => void;
} & Omit<UseQueryOptions<T>, "queryKey">; // omitted due to issues when passing options in components

export const useGetAllItemsQuery = (
  options?: UseQueryOptionsWithCallbacks<ItemWithoutDetails[]>,
) =>
  useQuery({
    ...options,
    queryKey: itemsKeyFactory.items(),
    queryFn: () => {
      options?.pre?.();
      return fetchAllItems();
    },
  });

export const useGetItemByIdQuery = (
  itemId?: Item["id"],
  options?: UseQueryOptionsWithCallbacks<ItemWithoutDetails | undefined>,
) =>
  useQuery({
    ...options,
    queryKey: itemsKeyFactory.item(itemId!),
    queryFn: () => {
      options?.pre?.();
      return fetchItem(itemId!);
    },
    enabled: !!itemId,
  });

export const useGetItemDetailsByIdQuery = (
  itemId?: Item["id"],
  options?: UseQueryOptionsWithCallbacks<ItemWithoutDetails | undefined>,
) =>
  useQuery({
    ...options,
    queryKey: itemsKeyFactory.itemDetails(itemId!),
    queryFn: () => {
      options?.pre?.();
      return fetchItemDetails(itemId!);
    },
    enabled: !!itemId,
  });

export const useAddItemMutation = (options?: UseMutationOptions) =>
  useMutation({
    ...options,
    mutationFn: addItem,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });

      options?.onSuccess?.(...params);
    },
  });

export const useDeleteItemMutation = (
  options?: UseMutationOptions<unknown, unknown, unknown>,
) =>
  useMutation({
    ...options,
    mutationFn: (...params: Parameters<typeof deleteItem>) =>
      deleteItem(...params),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });

      options?.onSuccess?.(...params);
    },
  });

export const useUpdateItemNameMutation = (
  options?: UseMutationOptions<unknown, unknown, unknown>,
) =>
  useMutation({
    ...options,
    mutationFn: (...params: Parameters<typeof updateItemName>) =>
      updateItemName(...params),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });

      options?.onSuccess?.(...params);
    },
  });

export const useUpdateItemDetailsNameMutation = (
  options?: UseMutationOptions<unknown, unknown, unknown>,
) =>
  useMutation({
    ...options,
    mutationFn: (...params: Parameters<typeof updateItemDetailsName>) =>
      updateItemDetailsName(...params),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.itemDetails(params[1].itemId),
      });

      options?.onSuccess?.(...params);
    },
  });
