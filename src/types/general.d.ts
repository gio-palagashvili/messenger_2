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
interface ChatList {
    name: string;
    email: string;
    image: string;
    id: string;
    text: string;
    timestamp: number;
    isGroup?: boolean;
    groupId?: string;
}