import { AxiosError } from "axios"
import { ZodError } from "zod"

export const handleError = (error: unknown, func?: Function) => {
    if (error instanceof ZodError) {
        if (func) {
            func();
            return;
        }
        return new Response('invalid req', { status: 400 });
    }
    if (error instanceof AxiosError) {
        if (func) {
            func();
            return;
        }
    }
}