import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
    id: string,
    content: string,
    sender: {
        id: string,
        username: string
    };
    createdAt: string
}

interface FetchChatMessageResponse {
    messages: Message[];
    nextCursor: string | null;
}

const fetchChatMessages = async ({ pageParam = null, queryKey} : { pageParam: unknown, queryKey: any}): Promise<FetchChatMessageResponse> => {
    const chatId = queryKey[1];
    const cursor = pageParam as string | null;
    const params = new URLSearchParams();
    params.append("limit", "10");
    if (cursor) {
        params.append("cursor", cursor);
    }

    const response = await axios.get(`${BACKEND_URL}/chats/${chatId}/messages?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data)
    return response.data;
}


const MessageBox = ({chatId}: {chatId: string | null}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const {
        data, 
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery<FetchChatMessageResponse, Error>({
        queryKey: ["messages", chatId],
        queryFn: fetchChatMessages,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null
    })
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'auto', block: 'end'});
    }, [data])
    
    if(isLoading){
        return <div>loading...</div>
    }
    if (isError) {
        return <div>Error</div>
    }
  return (
    <ScrollArea
        className=" mt-4 w-full h-96 overflow-y-auto bg-zinc-900 p-6"
    >
        {data?.pages.flatMap(page => page.messages).length === 0 && <div className="border rounded-lg justify-between flex gap-2 p-2 mb-2">no messages</div>}
        <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>Load More</Button>
        {data?.pages.flatMap(page => page.messages).reverse().map((message, index) => (
            <div key={index} className="flex flex-col mb-4 gap-1">
                <div className="border rounded-lg justify-start flex gap-2 items-center p-2 bg-zinc-800 w-auto border-zinc-700">
                    <p>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{message.sender.username.slice(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </p>
                    <p className="h-auto">{message.content}</p>
                </div>
                <p className="text-xs pl-2 text-zinc-500">{new Date(message.createdAt).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata", // Set IST (Indian Standard Time) explicitly
                    weekday: "long",           // Show day of the week
                    year: "numeric",          // Show full year
                    month: "long",            // Show full month name
                    day: "numeric",           // Show day of the month
                    })}
                    {" "}
                    -{" "}
                    {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata", // Set IST
                    hour12: true,             // Use 12-hour format
                    hour: "2-digit",          // Show hours in 2 digits
                    minute: "2-digit",        // Show minutes in 2 digits
                    })}
                </p>
            </div>
        ))}
        <div ref={scrollRef}></div>
    </ScrollArea>
  )
}

export default MessageBox