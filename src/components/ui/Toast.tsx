"use client";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { FC, HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const toastVariant = cva(
  "absolute flex h-12 w-[400px] rounded-md right-4 bottom-3 p-3 gap-2 text-black capitalize justify-content-center place-items-center",
  {
    variants: {
      variant: {
        error: "bg-red-400",
        success: "bg-green-400",
      },
      size: {},
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariant> {
  shown?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  error: ToastError | undefined;
}

const Toast: FC<ToastProps> = ({
  className,
  children,
  shown,
  variant,
  error,
  size,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {error ? (
        <div
          className={cn(toastVariant({ variant, size, className }))}
          {...props}
        >
          {variant == "error" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-ban"
              data-darkreader-inline-stroke=""
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" x2="19.07" y1="4.93" y2="19.07"></line>
            </svg>
          ) : (
            props.icon
          )}
          {error.text}
        </div>
      ) : null}
    </motion.div>
  );
};

export default Toast;
