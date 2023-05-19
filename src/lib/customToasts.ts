import { toast } from "react-hot-toast";

export const successToast = (text: string) => {
    toast.success(text, {
        position: "bottom-right",
        style: {
            borderRadius: "10px",
            background: "#191D23",
            color: "#fff",
        },
    });
}

export const errorToast = (text: string) => {
    toast.error(text, {
        position: "bottom-right",
        style: {
            borderRadius: "10px",
            background: "#191D23",
            color: "#fff",
        },
    });
}