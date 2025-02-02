import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import MessageBox from "./MessageBox";
import { fetchProfile } from "@/pages/Profile";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { Input } from "./ui/input";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ChatParticipants {
    chatId: string,
    user: {
        id: string,
        username: string,
        profile: {
            name: string,
            avatar: string
        }
    }
}

interface ChatDetails {
    id: string;
    name: string;
    isPrivate: Boolean;
    type: 'PRIVATE' | 'GROUP';
    image: string,
    messages: Message[],
    participants: ChatParticipants[]
}

interface Message {
    id: string;
    content: string;
    type: string; // To capture the "type" field, e.g., "TEXT"
    createdAt: string;
    senderId: string; // To capture "senderId" directly
    chatId: string; // To capture "chatId" field
    sender: {
        id: string;
        username: string;
        profile: {
            avatar: string;
        }
    };
}

interface FetchChatMessagesResponse {
    pages: FetchChatMessagesResponse2[];
    pageParams: any[];
}
interface FetchChatMessagesResponse2 {
    messages: Message[]; 
    nextCursor: string | null;
}

const fetchChatDetails = async (chatId: string | null): Promise<ChatDetails> => {
    const response = await axios.get(`${BACKEND_URL}/chats/${chatId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    console.log(response.data)
    return response.data;
};


const ChatBox = ({chatId}: {chatId: string | null}) => {

    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const queryClient = useQueryClient();

    const { data: chatData, isLoading } = useQuery({
        queryKey: ["chatDetails", chatId],
        queryFn: () => fetchChatDetails(chatId),
        enabled: !!chatId,
    })

    const { data: profile, isLoading: profileLoading } = useQuery({
            queryKey: ["profile"],
            queryFn: fetchProfile
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token || !chatId){
            console.error("Token not found in localstorage");
            return;
        }

        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log("Websocket connected");
            ws.current?.send(JSON.stringify({
                type: 'join_chat',
                payload: {
                    chatId,
                    token
                }
            }))
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log("on message received", data);

            if(data.type === "receive_message"){
                console.log("ws received message....", data)
                const newMessage: Message = {
                    id: Date.now().toString(),
                    content: data.payload.message,
                    type: "TEXT",
                    senderId: data.metadata.senderId, 
                    chatId: data.payload.chatId || "", 
                    sender: {
                        id: data.metadata.senderId, 
                        username: data.metadata.sender.dbUserInfo.username,
                        profile: {
                            avatar: data.metadata.sender.dbUserInfo.avatar
                        }
                    },
                    createdAt: new Date().toISOString()
                };
                addMessageToCache(newMessage);
            }else if(data.type === "typing"){
                console.log("typing receive")
                setIsTyping(data.payload.message);
                setTimeout(() => setIsTyping(null), 3000);
            }
            
        }
        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
          };
      
          ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
          };
      
          return () => {
            ws.current?.close();
          };
    },[chatId])
    
    const handleSendMessage = () => {
        console.log("handle send message")
        setIsSending(true);
        if(!ws.current || !messageInput.trim()) return;

        const token = localStorage.getItem('token');

        ws.current.send(JSON.stringify({
            type: "send_message",
            payload: {
                chatId,
                token,
                message: messageInput.trim(),
            }
        }))
        //setting it to cache
        const newMessage: Message = {
            id: Date.now().toString(),
            content: messageInput,
            type: "TEXT",
            senderId: profile?.id!, 
            chatId: chatId || "", 
            sender: {
                id: profile?.id!, 
                username: profile?.username!,
                profile: {
                    avatar: profile?.profile?.avatar!
                }
            },
            createdAt: new Date().toISOString()
        };
        addMessageToCache(newMessage);
        setMessageInput("")
        setIsSending(false);
    }
    const handleTyping = () => {
        if(!ws.current) return;
        console.log("handle typing")
        const token = localStorage.getItem('token');
        ws.current.send(
            JSON.stringify({
                type: "typing_start",
                payload: {
                    chatId,
                    token
                }
            })
        )
    }

    const addMessageToCache = (newMessage: Message) => {
        queryClient.setQueryData<FetchChatMessagesResponse>(["messages", chatId], (oldData) => {
            if (!oldData) {
                return { pages: [{ messages: [newMessage], nextCursor: null }], pageParams: [null] }
            };

            const updatedPages = oldData.pages.map((page, index) => (index === 0
                ? { ...page, messages: [newMessage, ...page.messages] } // Add new message to the first page
                : page));

            return { ...oldData, pages: updatedPages };
        });
    };


    if (isLoading) {
        return <p>Loading...</p>;
      }
  return (
    <section className="flex flex-col justify-between items-center rounded-lg border p-4 bg-[#191919] border-zinc-700 overflow-clip pb-4">
        <div className="p-4 flex relative items-center gap-4 bg-zinc-800 w-full rounded-lg">
            <div className="f">
                <Avatar className="">
                    <AvatarImage src={chatData?.type === 'GROUP' ? chatData?.image : chatData?.participants.filter(participant => participant.user.id !== profile?.id)[0].user.profile.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <h1 className="font-semibold">{chatData?.type === 'GROUP' ? chatData?.name : chatData?.participants.filter(participant => participant.user.id !== profile?.id)[0].user.profile.name}  <Badge>{chatData?.type}</Badge></h1>
                <p className="text-sm text-green-300">{isTyping}</p>
            </div>
            <div className="absolute flex flex-col top-1 right-1">
                <Badge className="text-xs">chat id: {chatData?.id}</Badge>
            </div>
        </div>
        {/* chat messages */}
        <MessageBox chatId={chatId}/>
        {/* Input section */}
        <div className="flex gap-2 mt-4 w-full">
            <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                    handleTyping();
                    if(e.key === "Enter"){
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-zinc-800 text-white outline-none border-none focus-visible:ring-zinc-700"
            />
            <Button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-lg text-white hover:border-zinc-700"
                disabled={isSending || messageInput === ""}
            >
                <IoSend/>
            </Button>
        </div>
    </section>
  )
}

export default ChatBox