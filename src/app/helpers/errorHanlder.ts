import { AxiosError } from "axios"
import { ZodError } from "zod"

export const handleError = (error: any) => {
    if (error instanceof ZodError) {
        return new Response(error.message, { status: 500 });
    }
    if (error instanceof AxiosError) {
        return new Response(error.message, { status: 500 });
    }
    if (error instanceof Error) {
        return new Response(error.message, { status: 500 });
    }
    console.error(error);
    return new Response("Unknown error", { status: 500 });
}