import * as React from "react";

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

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center  max-w-[500px] font-[50px] mx-auto my-[150px]">
      <form action="http://localhost:8080/user/register" method="post">
        <Card className="w-[500px] font-[200px]">
          <CardHeader>
            <CardTitle>ユーザー登録</CardTitle>
            <CardDescription>
              登録したいユーザーの情報を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">User Name</Label>
                <Input id="name" placeholder="Add your user name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="Add your email address" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Add your password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Deploy</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default RegisterPage;
