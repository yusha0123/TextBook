"use client";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <li className="list-none">
      <button
        className="bg-gray-500 hover:bg-gray-700  active:bg-gray-700 text-white text-sm px-6 py-2 text-light rounded-md"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </li>
  );
};

export default Login;
