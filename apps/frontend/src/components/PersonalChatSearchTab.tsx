import {useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PersonalChatSearchTab = ({ username, id}: {username: string, id: string}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

  return (
    <div className="flex p-2 justify-between items-center h-10 bg-[#191919] border-zinc-700">   
        <Button
            className="p-0"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar className="w-6 h-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-sm">{username}</p>
                </div>
            </div>
        </Button>
    </div>
  )
}

export default PersonalChatSearchTab