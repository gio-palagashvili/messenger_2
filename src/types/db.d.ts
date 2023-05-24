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
interface Group {
    name: string,
    members: string[],
    image: string;
}
interface GroupMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}
interface GroupListItem {
    groupId: string;
    name: string;
    latestMessage: string;
    senderId: string;
    timestamp: number;
    image: string;
}