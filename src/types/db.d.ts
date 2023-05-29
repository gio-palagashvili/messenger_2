interface User {
    id: string
    name: string
    email: string
    image: string
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
    sender: User;
    text: string;
    timestamp: number;
}
interface GroupListItem {
    groupId: string;
    name: string;
    latestMessage: string;
    senderName: string;
    timestamp: number;
    image: string;
}