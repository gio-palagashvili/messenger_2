interface ToastError {
    text: string;
    index?: number;
}
interface ToastComplete {
    text: string;
}
interface Loading {
    isLoading: boolean;
    index?: number;
}