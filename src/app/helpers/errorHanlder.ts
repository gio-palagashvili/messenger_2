import { AxiosError } from "axios"
import { ZodError } from "zod"

export const handleError = (error: unknown, func?: void) => {
    if (error instanceof ZodError) {
        return new Response('invalid data', { status: 400 });
    }
    if (error instanceof AxiosError) {
        return new Response('invalid req', { status: 400 });
    }
    return;
}