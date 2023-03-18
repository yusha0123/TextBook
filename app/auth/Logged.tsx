"use client";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
      <button
        className="bg-gray-500 hover:bg-gray-700  active:bg-gray-700 text-white text-sm px-6 py-2 text-light rounded-md"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </li>
  );
};

export default Logged;
