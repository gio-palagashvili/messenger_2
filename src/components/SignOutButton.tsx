"use client";
import { ButtonHTMLAttributes, FC, ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const SignOutButton: FC<SignOutButtonProps> = ({ children, ...props }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Button
      onClick={async () => {
        setLoading(true);
        try {
          await signOut();
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }}
      isLoading={loading}
    >
      {children}
    </Button>
  );
};

export default SignOutButton;
