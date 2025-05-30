"use client";

import { DataTable } from "@/app/stock/view/data-table";
import { useEffect, useState } from "react";

type Item = {
  ID: number;
  itemname: string;
  itemkind: string;
  itemnum: number;
  isneeded: boolean;
};

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@radix-ui/react-checkbox";

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "itemname",
    header: () => <div className="text-center">アイテム名</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("itemname")}</div>
    ),
  },
  {
    accessorKey: "itemkind",
    header: () => <div className="text-center">種類</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("itemkind")}</div>
    ),
  },
  {
    accessorKey: "itemnum",
    header: () => <div className="text-center">在庫数</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("itemnum")}</div>
    ),
  },
  {
    accessorKey: "isneeded",
    header: () => <div className="text-center">追加発注</div>,
    cell: () => <div>unnti</div>,
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
    <div className="border-2 ronded-[5px] w-[500px] mx-auto mt-[100px] p-3 text-center">
      <DataTable columns={columns} data={items} />
    </div>
  );
};

export default ItemView;
