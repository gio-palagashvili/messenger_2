"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "@/types/zod";
import { handleError } from "@/app/helpers/errorHanlder";
// todo
interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [complete, setComplete] = useState<boolean>(false);
  const { register, handleSubmit, setError, formState, clearErrors } =
    useForm<FormData>({
      resolver: zodResolver(validateFriend),
    });

  const addFriend = async (email: string) => {
    try {
      const valid = validateFriend.parse({ email });
      await axios.post("/api/friend/add", {
        email: email,
      });
      clearErrors("email");
      setComplete(true);
    } catch (error: any) {
      if (error instanceof ZodError) {
        setError("email", { message: "invalid email" });
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: "invalid request" });
        return;
      }
      setError("email", { message: "unknown error" });
    }
  };
  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form
      className="flex flex-col gap-4 w-1/2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="email">who u adding</label>
      <input
        type="text"
        {...register("email")}
        className="bg-transparent border-slate-600 border p-2 outline-none"
      />
      <p>{formState.errors.email?.message}</p>
      <p>{complete ? "sent friend request" : ""}</p>
      <Button>Add</Button>
    </form>
  );
};

export default AddFriendButton;
