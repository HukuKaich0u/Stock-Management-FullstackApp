"use client"; // Next.js のクライアントコンポーネントとしてマーク

import { DataTable } from "@/components/data-table"; // あなたのデータテーブルコンポーネントのパス
import React, { useEffect, useState, useMemo } from "react"; // React, useEffect, useState, useMemo をインポート

// アイテムの型定義
type Item = {
  ID: number;
  itemname: string;
  itemkind: string;
  itemnum: number;
  isneeded: boolean;
};

// @tanstack/react-table の ColumnDef をインポート
import { ColumnDef } from "@tanstack/react-table";
// shadcn/ui の Checkbox コンポーネントをインポート
import { Checkbox } from "@/components/ui/checkbox";

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

/**
 * DataTable のカラム定義を生成する関数
 * @param setItems items ステートを更新するためのセッター関数
 * @returns ColumnDef<Item>[] カラム定義の配列
 */
const getColumns = (
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
): ColumnDef<Item>[] => [
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

          // APIリクエストが成功した場合のみ、UIの状態を更新
          setItems((prevItems) =>
            prevItems.map(
              (i) =>
                i.ID === item.ID ? { ...i, isneeded: newCheckedState } : i // 該当アイテムの isneeded を新しい状態に更新
            )
          );
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
          setItems((prevItems) =>
            prevItems.map(
              (i) => (i.ID === item.ID ? { ...i, isneeded: item.isneeded } : i) // 元の isneeded の値に戻す
            )
          );
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

/**
 * アイテム一覧表示コンポーネント
 */
export const ItemView = () => {
  const [items, setItems] = useState<Item[]>([]); // アイテムデータのステート
  const [loading, setLoading] = useState(true); // データロード中の状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージのステート

  // useMemo を使用してカラム定義をメモ化
  // setItems 関数が変わらない限り、カラム定義の再生成を防ぐことでパフォーマンスを最適化
  const memoizedColumns = useMemo(() => getColumns(setItems), [setItems]);

  // コンポーネトがマウントされた時に一度だけデータをフェッチ
  useEffect(() => {
    fetchItems();
  }, []); // 依存配列が空なので、初回レンダリング時のみ実行

  /**
   * APIからアイテムデータを取得する非同期関数
   */
  const fetchItems = async () => {
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
  };

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

  // 成功時のデータテーブル表示
  return (
    <div className="border-2 rounded-[5px] w-[500px] p-3 text-center">
      <DataTable columns={memoizedColumns} data={items} />
    </div>
  );
};

export const ItemRegister = () => {
  const [itemName, setItemName] = useState("");
  const [itemKind, setItemKind] = useState("");
  const [itemNumStr, setItemNumStr] = useState("");
  const [itemNum, setItemNum] = useState(0);
  const [isNeeded, setIsNeeded] = useState(false);
  const selectValue = isNeeded ? "Yes" : "No";

  useEffect(() => {
    if (!itemNumStr) {
      setItemNum(0);
    } else {
      setItemNum(parseInt(itemNumStr, 10));
    }
  }, [itemNumStr]);

  const handlSelectValue = (selectedValue: string) => {
    if (selectedValue == "Yes") {
      setIsNeeded(true);
    } else if (selectedValue == "No") {
      setIsNeeded(false);
    }
  };

  const handleKind = (kind: string) => {
    setItemKind(kind);
  };

  const handleItemNumStr = (itemNumStr: string) => {
    setItemNumStr(itemNumStr);
  };

  const handleCancel = () => {
    setItemName("");
    setItemKind("");
    setIsNeeded(false);
    setItemNumStr("");
  };

  // itemName, kind, itemNum, isNeededをPOSTする
  const handleSubmit = async () => {
    await fetch("http://localhost:8080/stock/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemname: itemName,
        itemnum: itemNum,
        itemkind: itemKind,
        isNeeded: isNeeded,
      }),
    });
    handleCancel();
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>アイテムを在庫に登録する</CardTitle>
        <CardDescription>Register an item in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
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
      <CardFooter className="flex justify-between my-4">
        <Button variant="outline" onClick={handleCancel}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit}>追加</Button>
      </CardFooter>
    </Card>
  );
};
