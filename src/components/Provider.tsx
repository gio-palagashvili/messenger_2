"use client";
import { FC, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default Provider;
