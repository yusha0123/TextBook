"use client";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "primereact/button";

type User = {
  image: string;
};
const Logged = ({ image }: User) => {
  return (
    <li className="flex gap-4 items-center">
      <Link href={"/dashboard"}>
        <Image
          width={20}
          height={20}
          src={image}
          alt="userAvatar"
          priority
          className="w-10 rounded-full hover:opacity-75"
        />
      </Link>
      <Button
        label="Sign Out"
        size="small"
        severity="secondary"
        onClick={() => signOut()}
        icon="pi pi-sign-out"
      />
    </li>
  );
};

export default Logged;
