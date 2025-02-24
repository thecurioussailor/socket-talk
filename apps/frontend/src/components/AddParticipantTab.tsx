import { IoMdAdd } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MouseEvent } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const addParticipantToGroupChat = async ({chatId, userId}: {chatId: string, userId: string}) => {
    const response = await axios.post(`${BACKEND_URL}/chats/${chatId}/participants`, {
        userId,
        role: "MEMBER"
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    return response.data;
}
const AddParticipantTab = ({ username,name, id, avatar, chatId, onClose}: {username: string, name: string, id: string, avatar: string, chatId: string, onClose: () => void}) => {

    const { toast } = useToast();
    const queryClient = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: addParticipantToGroupChat,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chatDetails", chatId]
            })
            toast({
                title: "Participant added successfully",
                description: "You have added user successfully to the group chat"
            })
        },
        onError: () => {
            toast({
                title: "Error while adding participant",
                description: `Cannot add participant right now. Please try after sometimes`
            })
        }
    })
    const handleAddParticipant = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        mutate({userId: id,chatId});
        onClose()
    }
  return (
    <div className="flex justify-between items-center h-10 bg-[#191919] border border-zinc-700 rounded-sm">   
        <div
            className="flex flex-row items-center justify-between w-full p-4"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-xs">{username}</p>
                    <p className="text-left text-xs">{name}</p>
                </div>
            </div>
            <Button 
                className="bg-transparent"
                onClick={handleAddParticipant}
            >
                <IoMdAdd/>
            </Button>
        </div>
    </div>
  )
}

export default AddParticipantTab