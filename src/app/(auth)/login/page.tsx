"use client";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import logo from "@/assets/messenger.png";

const page = ({}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [errorSi, setError] = useState<string>();

  const loginGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center place-items-center">
      <div className="w-96 flex place-items-center flex-col gap-5 p-12 h-[500px] justify-center">
        <div className="h-16 w-16">
          <Image src={logo} alt="logo" referrerPolicy="no-referrer" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Messenger</h1>
          <p className="text-zinc-400">message anyone at any time</p>
        </div>
        <Button
          className="flex justify-center place-items-center gap-2 w-full"
          onClick={loginGoogle}
          isLoading={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
          >
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />{" "}
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default page;
