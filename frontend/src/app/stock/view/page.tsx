"use client";

import { DataTable } from "@/app/stock/view/data-table";
import { useEffect, useState } from "react";

type Item = {
  ID: number;
  itemName: string;
  kind: string;
  stockNum: number;
  isNeeded: boolean;
};

import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "itemname",
    header: "itemName",
  },
  {
    accessorKey: "kind",
    header: "kind",
  },
  {
    accessorKey: "stocknum",
    header: "stockNum",
  },
  {
    accessorKey: "isneeded",
    header: "isNeeded",
  },
];

const ItemView = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:8080/stock/view");
    const data = await res.json();
    setItems(data);
  };

  return (
    <div className="border-2 ronded-[5px] w-[500px] mx-auto mt-[50px] p-3">
      <DataTable columns={columns} data={items} />
    </div>
  );
};

export default ItemView;
