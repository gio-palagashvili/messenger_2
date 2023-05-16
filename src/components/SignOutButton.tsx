"use client";
import { ButtonHTMLAttributes, FC, ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const SignOutButton: FC<SignOutButtonProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const signOutImplement = async () => {
    try {
      setLoading(true);
      await signOut({ callbackUrl: "/login" });
    } catch (error: any) {
      toast.error(error, {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        onClick={async () => await signOutImplement()}
        isLoading={loading}
        variant={"default"}
        className="aspect-square"
        showLoading={false}
      >
        {children}
      </Button>
    </>
  );
};

export default SignOutButton;
