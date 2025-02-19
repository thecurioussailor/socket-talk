import { IoClose } from "react-icons/io5"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { fetchChatDetails } from "./ChatBox"
import { Badge } from "./ui/badge"

const ChatInfoDialogBox = ({chatId, onClose}: {chatId: string | null, onClose: () => void}) => {
  const { data: chatData, isLoading } = useQuery({
    queryKey: ["chatDetails", chatId],
    queryFn: () => fetchChatDetails(chatId),
    enabled: !!chatId,
})
  return (
    <section className="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50">
      <div className="border w-2/5 rounded-xl border-zinc-700 p-6 bg-[#191919]">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-bold italic text-zinc-200">Chat Info</h1>
            <Button
              className="border border-zinc-600 w-2 h-2 p-3 bg-transparent"
              onClick={onClose}
            >
              <IoClose/>
            </Button>
        </div>
        <div className="pt-4 flex flex-col items-center justify-center">
          <div>
            <Avatar >
              <AvatarImage src={chatData?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col justify-center items-center pt-4 gap-1">
            <h1 className="text-3xl font-bold">{chatData?.name}</h1>
            <p className="text-xs italic">chat id: {chatData?.id}</p>
            <p></p>
            <Badge>{chatData?.type}</Badge>
            <p className="text-sm">Type: {chatData?.isPrivate ? "Private" : "Public"}</p>
            <p className="text-sm">Created at {chatData?.createdAt} </p>
            <p className="text-sm">{chatData?.participants.length} participants</p>
            <p className="text-sm">Owner: {chatData?.participants.filter(participant => participant.role === 'OWNER').map(owner => (<span>{owner.user.profile.name}</span>))}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatInfoDialogBox