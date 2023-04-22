"use client";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "@/types/zod";
import Toast from "./ui/Toast";
import { error } from "console";

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [complete, setComplete] = useState<boolean>(false);
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isLoading },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(validateFriend),
  });
  const toast = () => {
    return (
      <Toast
        setShouldShow={setShouldShow}
        error={{ error: "id", text: `${errors.email?.message}` }}
        variant={"error"}
      />
    );
  };
  const addFriend = async (email: string) => {
    try {
      const valid = validateFriend.parse({ email });
      await axios.post("/api/friends/add", {
        email: email,
      });

      clearErrors("email");
      setComplete(true);
    } catch (error: any) {
      setShouldShow(true);
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
    <div className="w-full flex flex-col gap-3">
      <h1 className="text-4xl bold">Add a friend</h1>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Enter an email</label>
          <input
            type="text"
            {...register("email")}
            className="bg-transparent border-slate-600 border p-2 outline-none"
          />
        </div>
        <Button isLoading={isSubmitting}>Add</Button>
        {errors.email ? (
          <Toast
            setShouldShow={setShouldShow}
            error={{ error: "id", text: `${errors.email?.message}` }}
            variant={"error"}
          />
        ) : (
          ""
        )}

        <p>{complete ? "sent friend request" : ""}</p>
      </form>
    </div>
  );
};

export default AddFriendButton;
