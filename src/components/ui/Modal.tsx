import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { RefObject } from "react";

export const variants = cva(
  "absolute w-[100vw] h-[100vh] left-0 z-10 top-0 flex",
  {
    variants: {
      variant: {
        default: "",
        blur: "cl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ModalProps extends VariantProps<typeof variants> {
  children: React.ReactNode;
  ref: RefObject<HTMLDivElement>;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className, variant }, ref) => (
    <div className={cn(variants({ variant }))}>
      <div
        ref={ref}
        className="bg-main self-center rounded-lg drop-shadow-md m-auto h-[38rem] w-[28rem] px-4 pt-10"
      >
        {children}
      </div>
    </div>
  )
);

Modal.displayName = "modal";

export default Modal;
