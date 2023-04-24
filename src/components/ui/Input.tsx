import { FC, InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const inputVariants = cva("input", {
  variants: {
    variant: {
      default: "w-full bg-base-200",
      ghost: "input-ghost",
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

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, children, showLoading = true, variant, isLoading, ...props },
    ref
  ) => {
    return (
      <input
        className={cn(inputVariants({ variant, className }))}
        disabled={isLoading && showLoading}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
