"use client";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "@/types/zod";
import Input from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { errorToast, successToast } from "@/lib/customToasts";

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

      successToast(`sent to ${email}`);
      clearErrors("email");
      setComplete(true);
    } catch (error: any) {
      if (error instanceof ZodError) {
        errorToast("invailid email");
        return;
      }
      if (error instanceof AxiosError) {
        errorToast(error.response?.data);
        return;
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    await addFriend(data.email);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="email" className="ml-1">
          Email
        </label>
        <div className="flex gap-3 w-full">
          <Input
            type="text"
            {...register("email")}
            className={cn("w-[90%]", errors.email ? "ring-red-400 ring-1" : "")}
            placeholder="gio@gmail.com"
          />
          <Button
            isLoading={isSubmitting}
            showLoading={false}
            className="min-w-[4rem]"
          >
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddFriendButton;
