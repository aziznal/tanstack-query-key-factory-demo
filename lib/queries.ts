import { queryClient } from "@/components/QueryClientProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generate as generateRandomWords } from "random-words";

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

const generateRandomId = () => {
  return Math.floor(Math.random() * 10 ** 6).toString();
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

  console.log(currentItems);

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

export const useGetAllItemsQuery = () =>
  useQuery({
    queryKey: itemsKeyFactory.items(),
    queryFn: fetchAllItems,
  });

export const useGetItemByIdQuery = (itemId?: Item["id"]) =>
  useQuery({
    queryKey: itemsKeyFactory.item(itemId!),
    queryFn: () => fetchItem(itemId!),
    enabled: !!itemId,
  });

export const useGetItemDetailsByIdQuery = (itemId?: Item["id"]) =>
  useQuery({
    queryKey: itemsKeyFactory.itemDetails(itemId!),
    queryFn: () => fetchItemDetails(itemId!),
    enabled: !!itemId,
  });

export const useAddItemMutation = () =>
  useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });
    },
  });

export const useDeleteItemMutation = () =>
  useMutation({
    mutationFn: (...params: Parameters<typeof deleteItem>) =>
      deleteItem(...params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });
    },
  });

export const useUpdateItemNameMutation = () =>
  useMutation({
    mutationFn: (...params: Parameters<typeof updateItemName>) =>
      updateItemName(...params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.items(),
      });
    },
  });

export const useUpdateItemDetailsNameMutation = () =>
  useMutation({
    mutationFn: (...params: Parameters<typeof updateItemDetailsName>) =>
      updateItemDetailsName(...params),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: itemsKeyFactory.itemDetails(params.itemId),
      });
    },
  });
