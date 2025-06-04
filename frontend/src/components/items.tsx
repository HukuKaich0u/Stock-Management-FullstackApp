"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DataTable } from "./data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

// アイテムの型定義
type Item = {
  ID: number;
  itemname: string;
  itemkind: string;
  itemnum: number;
  isneeded: boolean;
};
/**
 * DataTable のカラム定義を生成する関数
 * @param setItems items ステートを更新するためのセッター関数
 * @returns ColumnDef<Item>[] カラム定義の配列
 */
const getColumns = (
  handleDelete: (id: number) => Promise<void>,
  fetchItems: () => Promise<void>
): ColumnDef<Item>[] => [
  {
    accessorKey: "ID",
    header: () => <div className="text-center">削除</div>,
    cell: ({ row }) => {
      const id: number = row.getValue("ID");
      return (
        <div className="text-center">
          <Button onClick={() => handleDelete(id)}>x</Button>
        </div>
      );
    },
  },
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
    cell: ({ row }) => {
      const item: Item = row.original; // 現在行のデータ
      const currentIsNeeded: boolean = item.isneeded; // チェックボックスの現在の表示状態

      /**
       * チェックボックスの状態変更時に呼び出される非同期ハンドラ
       * @param newCheckedState チェックボックスの新しい状態 (true/false)
       */
      const handleCheckedChange = async (newCheckedState: boolean) => {
        try {
          // APIリクエストの実行
          const res = await fetch(`http://localhost:8080/items/${item.ID}`, {
            method: "PATCH", // 部分更新のため PATCH メソッドを使用
            headers: { "Content-Type": "application/json" }, // JSON形式であることを指定
            body: JSON.stringify({
              // Goのバックエンドが InputItem 全体を期待するため、既存の他のフィールドも送信
              isneeded: newCheckedState, // ユーザーが変更した新しい状態を送信
            }),
          });

          // APIからの応答が成功したかを確認 (HTTPステータスコード 2xx 以外はエラー)
          if (!res.ok) {
            // エラーレスポンスのボディをパースして詳細なエラーメッセージを取得
            const errorData = await res.json();
            // エラーメッセージを組み立てて例外をスロー
            throw new Error(
              `Failed to update item: ${errorData.message || res.statusText}`
            );
          }

          await fetchItems();
        } catch (error) {
          // APIリクエスト中にエラーが発生した場合
          console.error("アイテムの更新に失敗しました:", error); // コンソールにエラーログを出力
          // ユーザーにエラーメッセージを表示
          alert(
            "アイテムの更新に失敗しました。詳細: " +
              (error instanceof Error ? error.message : "不明なエラー")
          );

          // ★重要★ エラーが発生した場合、UIを元の状態に戻す
          // これにより、UIとデータベースの不整合を防ぎ、ユーザーに正しい情報を表示

          await fetchItems();
        }
      };

      return (
        <div className="text-center">
          <Checkbox
            checked={currentIsNeeded} // 現在のアイテムの isneeded 状態をチェックボックスにバインド
            onCheckedChange={handleCheckedChange} // 状態変更ハンドラを設定
            aria-label="Toggle needed status" // アクセシビリティのためのラベル
          />
        </div>
      );
    },
  },
];

const ItemPage = () => {
  const [itemName, setItemName] = useState("");
  const [itemKind, setItemKind] = useState("");
  const [itemNumStr, setItemNumStr] = useState("");
  const [itemNum, setItemNum] = useState(0);
  const [isNeeded, setIsNeeded] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectValue: string = isNeeded ? "Yes" : "No";

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true); // ロード開始
      setError(null); // 前回のエラーをリセット

      const res = await fetch("http://localhost:8080/items");

      // APIからの応答が成功したかを確認 (HTTPステータスコード 2xx 以外はエラー)
      if (!res.ok) {
        // エラーレスポンスのボディをパースして詳細なエラーメッセージを取得
        const errorData = await res.json();
        throw new Error(
          `Failed to fetch items: ${errorData.message || res.statusText}`
        );
      }

      const data = await res.json(); // JSONデータをパース
      setItems(data); // ステートを更新
    } catch (err) {
      // データ取得中にエラーが発生した場合
      if (err instanceof Error) {
        setError(err.message); // エラーメッセージをステートに保存
      } else {
        setError("不明なエラーが発生しました。"); // 型不明のエラーの場合
      }
      console.error("データの取得に失敗しました:", err); // コンソールにエラーログ
    } finally {
      setLoading(false); // ロード終了
    }
  }, [setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // input type="number"で受け取った値を数字に変換する処理
  // itemNumStrに変更があればこのuseEffect関数を実行する
  useEffect(() => {
    // itemNumStr が空文字列の場合に 0 に設定するように修正
    setItemNum(itemNumStr ? parseInt(itemNumStr, 10) : 0);
  }, [itemNumStr]);

  const handleDelete = useCallback(
    async (id: number) => {
      await fetch(`http://localhost:8080/items/${id}`, {
        method: "DELETE",
      });
      fetchItems();
    },
    [fetchItems]
  );

  const memoizedColumns = useMemo(
    () => getColumns(handleDelete, fetchItems),
    [handleDelete, fetchItems]
  );

  // ローディング状態の場合の表示
  if (loading) {
    return (
      <div className="text-center mt-8">
        <p>アイテムをロード中...</p>
      </div>
    );
  }

  // エラー状態の場合の表示
  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">
        <p>データの取得に失敗しました: {error}</p>
        <button
          onClick={fetchItems}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再試行
        </button>
      </div>
    );
  }

  const handleCancel = () => {
    setItemName("");
    setItemKind("");
    setIsNeeded(false);
    setItemNumStr("");
  };

  const handleKind = (itemKind: string) => {
    setItemKind(itemKind);
  };

  const handleItemNumStr = (newItemNum: string) => {
    setItemNumStr(newItemNum);
  };

  const handleSelectValue = (selectedValue: string) => {
    // ★引数を受け取るように修正
    setIsNeeded(selectedValue === "Yes");
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:8080/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemname: itemName,
        itemnum: itemNum,
        itemkind: itemKind,
        isneeded: isNeeded,
      }),
    });
    fetchItems();
    handleCancel();
  };

  /**
   * APIからアイテムデータを取得する非同期関数
   */

  return (
    <div className="flex items-start justify-around mt-[50px]">
      <div className="mx-[50px] w-[500px]">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>アイテムを在庫に登録する</CardTitle>
              <CardDescription>Register an item in one click.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5 my-4">
                  <Label htmlFor="itemName">アイテム名</Label>
                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    id="itemName"
                    placeholder="追加するアイテムの名前"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 my-4">
                  <Label htmlFor="framework">種類</Label>
                  <Select value={itemKind} onValueChange={handleKind}>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="種類を選択してください" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="野菜">野菜</SelectItem>
                      <SelectItem value="果物">果物</SelectItem>
                      <SelectItem value="肉">肉</SelectItem>
                      <SelectItem value="魚">魚</SelectItem>
                      <SelectItem value="調味料">調味料</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex my-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="itemNum">在庫数</Label>
                    <Input
                      type="number"
                      id="itemNum"
                      placeholder="0"
                      value={itemNumStr}
                      onChange={(e) => handleItemNumStr(e.target.value)}
                      className="w-[100px]"
                    />
                  </div>
                  <div className="flex flex-col ml-3 space-y-1.5">
                    <Label>追加発注する？</Label>
                    <Select
                      value={selectValue}
                      onValueChange={handleSelectValue}
                    >
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
            </CardContent>
            <CardFooter className="flex justify-between my-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit}>追加</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="mx-[50px] w-[500px]">
        <DataTable columns={memoizedColumns} data={items} />
      </div>
    </div>
    // 成功時のデータテーブル表示
  );
};

export default ItemPage;
