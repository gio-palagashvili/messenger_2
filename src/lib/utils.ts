import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...input: ClassValue[]) => {
    return twMerge(clsx(input))
}
export const chatIdConstructor = (id1: string, id2: string) => {
    const sorted = [id1, id2].sort();
    return `${sorted[0]}--${sorted[1]}`;
}