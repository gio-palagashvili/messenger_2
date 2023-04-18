"use client";
import { ButtonHTMLAttributes, FC, ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import Toast from "./ui/Toast";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const SignOutButton: FC<SignOutButtonProps> = ({ children, ...props }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<ToastError>();

  const signOutM = async () => {
    try {
      setLoading(true);
      await signOut({ callbackUrl: "/login" });
    } catch (error: any) {
      setErrorToast({ error: error as string, text: "error signing out" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button onClick={async () => await signOutM()} isLoading={loading}>
        {children}
      </Button>
      <Toast error={errorToast} variant={"error"} />
    </>
  );
};

export default SignOutButton;
