"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef } from "react";
import { Avatar } from "primereact/avatar";

type User = {
  image: string;
  name: string;
};
const Logged = ({ image, name }: User) => {
  const menu = useRef<Menu>(null);
  const router = useRouter();
  const items: MenuItem[] = [
    {
      template: () => {
        return (
          <div className="flex items-center p-1 justify-center gap-2">
            <Avatar image={image} shape="circle" />
            <span className="font-bold">{name}</span>
          </div>
        );
      },
    },
    { separator: true },
    {
      label: "Dashboard",
      icon: "pi pi-user",
      command: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Sign Out",
      icon: "pi pi-sign-out",
      command: () => {
        signOut();
      },
    },
  ];
  return (
    <>
      <Button
        rounded
        text
        raised
        // severity="secondary"
        icon="pi pi-bars"
        onClick={(e) => menu.current?.toggle(e)}
      />
      <Menu model={items} popup ref={menu} />
    </>
  );
};

export default Logged;
