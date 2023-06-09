import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";

export const buttonVariants = cva(
  "gap-1 active:scale-95 duration-300 inline-flex items-center justify-center rounded-md text-sm font-medium disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:outline-blue-500",
  {
    variants: {
      variant: {
        default: "btn text-white capitalize min-width-[2200px]",
        ghost: "btn text-white capitalize bg-transparent border-none",
        ghostUnderline:
          "btn text-white capitalize bg-transparent border-none hover:bg-transparent hover:underline",
        pill: "bg-[#1A1D23] hover:bg-[#111318] rounded-md text-sm",
      },
      size: {
        default: "h-10 py-2 px-4",
        load: "h-10 py-2 px-4 min-w-[90px] w-[90px]",
        sm: "px-1 py-0 text-xs h-1",
        lg: "h-11 px-8",
        pill: "p-[0.3rem] px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  showLoading?: boolean;
  loadingType?: string;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  loadingType,
  showLoading = true,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading ? loadingType : ""
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-2 animate-spin h-5 w-5"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      ) : null}
      {isLoading ? (showLoading ? "loading" : "") : children}
    </button>
  );
};

export default Button;
