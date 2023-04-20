"use client";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "@/types/zod";

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [complete, setComplete] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isLoading },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(validateFriend),
  });

  const addFriend = async (email: string) => {
    try {
      const valid = validateFriend.parse({ email });
      await axios.post("/api/friends/add", {
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
    <div className="w-full">
      <h1 className="text-3xl">Add a friend</h1>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">who u adding</label>
        <input
          type="text"
          {...register("email")}
          className="bg-transparent border-slate-600 border p-2 outline-none"
        />
        <p>{errors.email?.message}</p>
        <p>{complete ? "sent friend request" : ""}</p>
        <Button isLoading={isSubmitting}>Add</Button>
      </form>
    </div>
  );
};

export default AddFriendButton;
