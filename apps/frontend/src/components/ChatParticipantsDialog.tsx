import { IoClose } from "react-icons/io5"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { SearchIcon } from "lucide-react"
import { Label } from "./ui/label"
import { ChatParticipants } from "./ChatBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchFriendByUsername } from "@/pages/Friends"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import AddParticipantTab from "./AddParticipantTab"



const ChatParticipantsDialog = ({chatId, chatParticipants, onClose}: {chatId: string, chatParticipants: ChatParticipants[],onClose: () => void}) => {
  const [searchParticipant, setSearchParticipant ] = useState("");
  const [isSearchParticipantDialogOpen, setSearchParticipantDialogOpen] = useState(false);
  const {data: friendByUsernameData, refetch: refetchFriendByUsername} = useQuery({
      queryKey: ["friendByUsername", searchParticipant],
      queryFn: () => fetchFriendByUsername(searchParticipant),
      enabled: false
  })

  const handleParticipantSearch = () => {
    setSearchParticipantDialogOpen(true);
    refetchFriendByUsername();
    console.log(friendByUsernameData);
  }
  return (
    <section className="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50">
      <div className="border w-2/5 rounded-xl border-zinc-700 p-6 bg-[#191919]">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-200">Participants</h1>
            <Button
              className="border border-zinc-600 w-2 h-2 p-3 bg-transparent"
              onClick={onClose}
            >
              <IoClose/>
            </Button>
        </div>
        <div className="pt-4 flex flex-col items-start justify-center w-full">
          <div className="flex flex-col items-start w-full">
            <Label
                className="text-xs text-gray-400 mb-2"
            >
                Add Participansts
            </Label>
            <div className="flex relative items-center border border-zinc-700 focus-visible:ring-zinc-600 rounded-lg w-full">
                <Input
                    type="text"
                    placeholder="Search"
                    className="border-none focus-visible:ring-0"
                    onChange={(e) => setSearchParticipant(e.target.value)}
                />
                <Button 
                    onClick={handleParticipantSearch}
                    className="bg-transparent"
                >
                    <SearchIcon/>
                </Button>
                {
                  isSearchParticipantDialogOpen && (
                    <div className="absolute top-10 w-2/3">
                      <AddParticipantTab 
                        username={friendByUsernameData?.username} 
                        name={friendByUsernameData?.profile?.name} 
                        id={friendByUsernameData?.id} 
                        avatar={friendByUsernameData?.profile?.avatar} 
                        chatId={chatId}
                        onClose={() => setSearchParticipantDialogOpen(false)}
                      />
                    </div>
                  )
                }
            </div>
          </div>
          <div className="flex flex-col pt-4 gap-1 w-full">
                <Label
                    className="text-xs text-gray-400 mb-2"
                >
                    Participansts
                </Label>
                <div className="">
                    {chatParticipants.map(participant => (
                        <div className="flex items-center gap-4 mb-2 border rounded-lg border-zinc-700 p-2">
                            <Avatar>
                              <AvatarImage src={participant?.user?.profile?.avatar} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{participant?.user?.profile?.name}</p>
                              <p className="text-xs lowercase">{participant?.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatParticipantsDialog