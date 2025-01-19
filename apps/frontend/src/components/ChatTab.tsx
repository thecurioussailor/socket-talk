import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

const ChatTab = ({chatId, chatName, lastMessage, chatType, onClick}: {chatId: string, chatName: string, lastMessage: string, chatType: string, onClick: () => void}) => {
  return (
    <Button 
        onClick={onClick}
        className="flex justify-between items-center h-24 rounded-2xl border border-zinc-700"
    >
                    <div className="flex items-center gap-4 p-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="text-left text-lg">{chatName}</p>
                            <p className="text-left text-xs">{lastMessage}</p>
                        </div>
                    </div>
                    <div>
                        <Badge>{chatType}</Badge>
                    </div>
                </Button>
  )
}

export default ChatTab