"use client";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "@/types/zod";
import Toast from "@/components/ui/Toast";
import Input from "@/components/ui/Input";

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [complete, setComplete] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(validateFriend),
  });
  const addFriend = async (email: string) => {
    setComplete(false);
    try {
      validateFriend.parse({ email });
      await axios.post("/api/friends/request", {
        email: email,
      });

      setComplete(true);
    } catch (error: any) {
      if (error instanceof ZodError) {
        // ??
        setError("email", { message: "invalid email" });
        clearErrors("email");
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "unknown error" });
    }
  };
  const onSubmit = async (data: FormData) => {
    await addFriend(data.email);
  };

  return (
    <div className="w-full flex flex-col place-items-center justify-center">
      <div className="w-[90%] flex flex-col gap-3 lg:w-[60%]">
        <h1 className="text-4xl bold ml-[0.20rem]">Add a friend</h1>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="ml-1">
              Enter an email
            </label>
            <div className="flex gap-3 w-full">
              <Input
                type="text"
                {...register("email")}
                placeholder="gio@gmail.com"
              />
              <Button isLoading={isSubmitting}>Add</Button>
            </div>
          </div>
          {errors.email ? (
            <Toast
              error={{ error: "id", text: `${errors.email?.message}` }}
              variant={"error"}
            />
          ) : null}
          {complete ? (
            <Toast variant={"success"} completeMessage="friend request sent" />
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default AddFriendButton;
