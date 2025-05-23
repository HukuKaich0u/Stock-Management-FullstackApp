import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

const Header = () => {
  return (
    <header className="h-10">
      <div className="relative flex items-center justify-between m-3 font-[100x] ">
        <div className="font-bold">
          <NavigationMenu>
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
              <NavigationMenuItem>
                <NavigationMenuTrigger>商品</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>商品在庫確認</NavigationMenuLink>
                  <NavigationMenuLink>登録商品確認</NavigationMenuLink>
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
