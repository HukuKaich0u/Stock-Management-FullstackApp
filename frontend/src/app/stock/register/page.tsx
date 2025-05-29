"use client";
import { useState } from "react";

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
  const [yesNo, setYesNo] = useState("");

  const handleCancel = () => {
    setItemName("");
    setKind("");
    setYesNo("");
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
              <Input id="itemName" placeholder="追加するアイテムの名前" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">種類</Label>
              <Select value={kind} onValueChange={setKind}>
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
              <div className="flex flex-col mr-3 space-y-1.5">
                <Label>補充する？</Label>
                <Select value={yesNo} onValueChange={setYesNo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yes or No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="stockNum">在庫数</Label>
                  <Input id="stockNum" placeholder="0" className="w-[100px]" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          キャンセル
        </Button>
        <Button>追加</Button>
      </CardFooter>
    </Card>
  );
};

export default ItemRegister;
