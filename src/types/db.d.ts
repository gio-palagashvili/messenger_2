interface User {
    name: string
    email: string
    image: string
    id: string
}
interface Message {
    id: string;
    senderId: string;
    recieverId: string;
    text: string;
    timestamp: number;
}
interface Chat {
    id: string;
    messages: Messages[];
}

interface FriendRequest {
    id: string;
    senderId: string;
    recieverId: string;
}