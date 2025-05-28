"use client";

import { useEffect, useState } from "react";

type Item = {
  ID: number;
  itemName: string;
  restock: boolean;
  stockNum: number;
};
const ItemList = () => {
  const [restock, setRestock] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:8080/items");
    const data = await res.json();
    setItems(data);
  };

  const handleToggleRestock = async (item: Item) => {
    await fetch(`http://localhost:8080/todos/${item.ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iscompleted: !item.restock,
      }),
    });
    fetchItems();
  };
  return (
    <div className="border-2 ronded-[5px] w-[500px] mx-auto mt-[50px] p-3">
      <div className="my-3">
        <ul className="flex justify-between items-center">
          <li className="w-[150px] text-center">補充</li>
          <li className="w-[200px] text-center">アイテム名</li>
          <li className="w-[150px] text-center">在庫数</li>
        </ul>
        <hr />
      </div>
      <div>
        {items.map((item) => (
          <ul className="flex justify-between items-center">
            <li className="w-[150px] text-center">
              <input type="checkbox" checked={item.restock} />
            </li>
            <li className="w-[200px] text-center">アイテム名</li>
            <li className="w-[150px] text-center">在庫数</li>
            <hr />
          </ul>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
