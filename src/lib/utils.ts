import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...input: ClassValue[]) => {
    return twMerge(clsx(input))
}