"use client";
import { signIn } from "next-auth/react";
import { Button } from "primereact/button";

const Login = () => {
  return <Button label=" Sign In" size="small" onClick={() => signIn()} />;
};

export default Login;
