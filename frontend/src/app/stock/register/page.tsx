"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ItemRegister = () => {
  const [itemName, setItemName] = useState("");
  const [kind, setKind] = useState("");
  const [stockNumStr, setStockNumStr] = useState("");
  const [stockNum, setStockNum] = useState(0);
  const [isNeeded, setIsNeeded] = useState(false);
  const selectValue = isNeeded ? "Yes" : "No";

  useEffect(() => {
    if (!stockNumStr) {
      setStockNum(0);
    } else {
      setStockNum(parseInt(stockNumStr, 10));
    }
  }, [stockNumStr]);

  const handlSelectValue = (selectedValue: string) => {
    if (selectedValue == "Yes") {
      setIsNeeded(true);
    } else if (selectedValue == "No") {
      setIsNeeded(false);
    }
  };

  const handleKind = (kind: string) => {
    setKind(kind);
  };

  const handleStockNumStr = (stockNumStr: string) => {
    setStockNumStr(stockNumStr);
  };

  const handleCancel = () => {
    setItemName("");
    setKind("");
    setIsNeeded(false);
    setStockNumStr("");
  };

  // itemName, kind, stockNum, isNeededをPOSTする
  const handleSubmit = async () => {
    await fetch("http://localhost:8080/stock/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: itemName,
        stockNum: stockNum,
        kind: kind,
        isNeeded: isNeeded,
      }),
    });
    handleCancel();
  };

  return (
    <Card className="w-[500px] mx-auto mt-[150px]">
      <CardHeader>
        <CardTitle>アイテムを在庫に登録する</CardTitle>
        <CardDescription>Register an item in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="itemName">アイテム名</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                id="itemName"
                placeholder="追加するアイテムの名前"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">種類</Label>
              <Select value={kind} onValueChange={handleKind}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="種類を選択してください" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="野菜">野菜</SelectItem>
                  <SelectItem value="肉">肉</SelectItem>
                  <SelectItem value="魚">魚</SelectItem>
                  <SelectItem value="調味料">調味料</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="stockNum">在庫数</Label>
                <Input
                  type="number"
                  id="stockNum"
                  placeholder="0"
                  value={stockNumStr}
                  onChange={(e) => handleStockNumStr(e.target.value)}
                  className="w-[100px]"
                />
              </div>
              <div className="flex flex-col ml-3 space-y-1.5">
                <Label>追加発注する？</Label>
                <Select value={selectValue} onValueChange={handlSelectValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yes or No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit}>追加</Button>
      </CardFooter>
    </Card>
  );
};

export default ItemRegister;
