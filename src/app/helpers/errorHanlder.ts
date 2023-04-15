import { AxiosError } from "axios"
import { ZodError } from "zod"

export const handleError = (error: any) => {
    if (error instanceof ZodError) {
        return new Response(error.message, { status: 400 });
    }
    if (error instanceof AxiosError) {
        return new Response('invalid req axios', { status: 400 });
    }
    return new Response(error.message, { status: 400 });
}