import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { FC, RefObject } from "react";

export const variants = cva(
  "absolute cl w-[100vw] h-[100vh] left-0 z-10 top-0 flex",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ModalProps extends VariantProps<typeof variants> {
  children: React.ReactNode;
  ref: RefObject<HTMLDivElement | any>;
  className?: string;
}

const Modal: FC<ModalProps> = ({ children, ref, className, variant, size }) => {
  return (
    <div className={cn(variants({ variant, size }))}>
      <div
        ref={ref}
        className="w-[30%] bg-main h-[80%] self-center px-4 pt-10 rounded-lg drop-shadow-md m-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
