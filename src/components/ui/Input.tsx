import { FC, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const inputVariants = cva("", {
  variants: {
    variant: {
      default: "bg-zinc-900 text-white hover:bg-zinc-700",
      ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  isLoading?: boolean;
  showLoading?: boolean;
}

const Input: FC<InputProps> = ({
  className,
  children,
  showLoading = true,
  variant,
  isLoading,
  ...props
}) => {
  return (
    <input
      className={cn(inputVariants({ variant, className }))}
      disabled={isLoading}
      {...props}
    />
  );
};

export default Input;
