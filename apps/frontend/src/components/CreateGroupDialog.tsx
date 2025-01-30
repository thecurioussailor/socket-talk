import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { IoAdd, IoClose } from "react-icons/io5";
import { Label } from "./ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {  useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SearchIcon } from "lucide-react";
import { fetchFriendByUsername } from "@/pages/Friends";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const createGroupChat = async ({name, isPrivate, image, participantIds}: {name: string, isPrivate: boolean, image: string, participantIds: {userId: string}[]}) => {
    const response = await axios.post(`${BACKEND_URL}/chats`, {
        type: "GROUP",
        name,
        isPrivate: isPrivate,
        image: image,
        participantIds,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    return response.data;
}

interface Participant {
    id: string,
    username: string,
    avatar: string
}
const CreateGroupDialog = ({onClose}: {onClose: () => void}) => {
    const {toast} = useToast();
    const [isAddGroupMemberDropdownOpen, setIsAddGroupMemberDropdownOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [groupName, setGroupName] = useState("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [image, setImage] = useState<string>("");
    const [participantIds, setParticipantsIds] = useState<string[]>([])
    const [participants, setParticipants] = useState<Participant[]>([])

    const queryClient = useQueryClient();
    const {data: friendByUsernameData, refetch: refetchFriendByUsername} = useQuery({
        queryKey: ["friendByUsername", search],
        queryFn: () => fetchFriendByUsername(search),
        enabled: false
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createGroupChat,
        onSuccess: () => {
            toast({
                title: "Group Created",
                description: "Group has been created successfully."
            })
            queryClient.invalidateQueries({
                queryKey: ["chats"]
            });
            onClose();
        },
        onError: (error) => {
            console.error("Group creation failed", error);
            toast({
                title: "Failed to create Group",
                variant: "destructive"
            })
        }
    })

    const handleUserSearch = async () => {
        
        await refetchFriendByUsername();
        console.log(friendByUsernameData);
        setIsAddGroupMemberDropdownOpen(true);
    }

    const handleAddGroupMember = async () => {
        console.log(participantIds);
        console.log(friendByUsernameData.id)
        if(friendByUsernameData && !participantIds.includes(friendByUsernameData.id)){
            setParticipantsIds([...participantIds, friendByUsernameData.id]);
            setParticipants([...participants, {id: friendByUsernameData.id, username: friendByUsernameData.username, avatar: friendByUsernameData.avatar}])
        }
        setSearch("");
        setIsAddGroupMemberDropdownOpen(false);
    }

    const handleCreateGroupChat = () => {
        mutate({
            name: groupName,
            isPrivate,
            image,
            participantIds: participantIds.map((id) => ({userId: id}))
        });
    }
    return (
    <section>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg p-6 w-1/3 border border-zinc-600 bg-[#191919]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-200">
                     Create Group
                </h2>
                <Button
                    type="button"
                    className="bg-transparent border h-2 w-2 p-3 border-zinc-600"
                    onClick={onClose}
                >
                    <IoClose />
                </Button>
              </div>
              <form onSubmit={handleCreateGroupChat} className="mt-4 space-y-2 text-white h-96">
                <ScrollArea className="h-full px-6 flex flex-col gap-4">
                    
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Group Name
                        </Label>
                        <Input
                            name="name"
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            className="border-none focus-visible:ring-zinc-600"
                            onChange={(e => setGroupName(e.target.value))}
                        />
                    </div>
                    <div className="flex gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Private
                        </Label>
                        <Checkbox
                            checked={isPrivate}
                            onCheckedChange={() => setIsPrivate(!isPrivate)}
                            className="bg-zinc-600 checked:bg-red-700"
                        />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Group Image Link
                        </Label>
                        <Input
                            name="name"
                            type="text"
                            placeholder="Group Name"
                            value={image}
                            className="border-none focus-visible:ring-zinc-600"
                            onChange={(e => setImage(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Add Members
                        </Label>
                        <div className="w-full relative flex">
                            <div className="w-full relative flex">   
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    className="border-none focus-visible:ring-zinc-600"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {
                                isAddGroupMemberDropdownOpen && (
                                    <div className="absolute top-12 left-0 z-50 w-full border border-zinc-700 rounded-lg bg-[#191919] p-1">
                                         {friendByUsernameData ? (
                                            <div className="flex p-2 justify-between items-center h-10 bg-[#191919] border-zinc-700">   
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAddGroupMember();
                                                        }}
                                                    className="p-0 flex flex-row justify-between items-center w-full"
                                                >
                                                    <div className="flex items-center gap-4 p-4">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={friendByUsernameData.profile?.avatar} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <p className="text-left text-sm font-semibold">{friendByUsernameData.profile?.name}</p>
                                                            <p className="text-left text-xs">{friendByUsernameData?.username}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <IoAdd/>
                                                    </div>
                                                </Button>
                                            </div>
                                         ): (
                                            <p className="text-xs p-1" onClick={() => setIsAddGroupMemberDropdownOpen(false)}>No user found</p>
                                         )}
                                    </div>
                                )
                                }
                            </div>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleUserSearch();
                                }}
                                className="bg-transparent hover:bg-transparent"
                            >
                                <SearchIcon/>
                            </Button>
                        </div>
                        <div>
                                {participants.map(participant => (
                                    <p className="text-xs italic">{participant.username}</p>
                                ))}
                            </div>
                    </div>
                    <div className="flex justify-center space-x-2 w-full">
                    <Button type="submit" disabled={isPending}  className="border border-zinc-600 bg-zinc-800 hover:bg-zinc-700">
                        Create
                    </Button>
                    </div>
                </ScrollArea>
              </form>
            </div>
          </div>
    </section>
  )
}

export default CreateGroupDialog