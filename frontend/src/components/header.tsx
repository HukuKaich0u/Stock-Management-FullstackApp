import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="relative flex items-center justify-between h-full p-2 font-[100x] ">
        <div className="flex items-center font-bold">
          <NavigationMenu className="mx-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>ユーザー</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/user/info">
                    ユーザー情報
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/user/register">
                    ユーザー登録
                  </NavigationMenuLink>
                  <NavigationMenuLink>ログイン</NavigationMenuLink>
                  <NavigationMenuLink>ログアウト</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu className="mx-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>アイテム</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/item">
                    アイテム管理
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center font-extrabold rounded ">
          <Link href="/">商品の在庫を管理するアプリケーション</Link>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
