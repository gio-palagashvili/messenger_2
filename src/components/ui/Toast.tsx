// "use client";
// import { cn } from "@/lib/utils";
// import { cva, VariantProps } from "class-variance-authority";
// import { FC, HTMLAttributes, ReactNode, useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export const toastVariant = cva(
//   "alert shadow-lg absolute w-1/2 md:w-1/3 lg:w-1/4 right-4 bottom-3 p-4 gap-2 text-black capitalize text-left",
//   {
//     variants: {
//       variant: {
//         error: "bg-red-main",
//         success: "bg-green-400",
//       },
//       size: {},
//     },
//     defaultVariants: {
//       variant: "error",
//     },
//   }
// );
// export interface ToastProps
//   extends HTMLAttributes<HTMLDivElement>,
//     VariantProps<typeof toastVariant> {
//   icon?: ReactNode;
//   children?: ReactNode;
//   completeMessage?: string;
//   error?: ToastError;
//   // setShouldShow: Dispatch<SetStateAction<boolean>>;
// }

// const Toast: FC<ToastProps> = ({
//   className,
//   children,
//   variant,
//   completeMessage,
//   error,
//   size,
//   ...props
// }) => {
//   const [show, setShow] = useState(true);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setShow(false);
//     }, 2000);

//     return () => clearTimeout(timeout);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: show ? 1 : 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {error ? (
//         <div
//           className={cn(toastVariant({ variant, size, className }))}
//           {...props}
//         >
//           <div>
//             {variant == "error" ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="stroke-current flex-shrink-0 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             ) : (
//               props.icon
//             )}
//             <span>Error! {error.text}</span>
//           </div>
//         </div>
//       ) : (
//         <div
//           className={cn(toastVariant({ variant, size, className }))}
//           {...props}
//         >
//           <div>
//             {variant == "success" ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="stroke-current flex-shrink-0 h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             ) : (
//               props.icon
//             )}
//             <span>{completeMessage}</span>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Toast;
