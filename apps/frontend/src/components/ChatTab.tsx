import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

const ChatTab = ({chatId, isSelected, chatName, image, lastMessage, chatType, onClick}: {chatId: string, isSelected: boolean,chatName: string, image: string, lastMessage: string, chatType: string, onClick: () => void}) => {
    
    return (
    <Button 
        onClick={onClick}
        className={`flex justify-between items-center h-24 w-full rounded-2xl border ${isSelected ? 'border-green-500' : 'border-zinc-700'}`}
    >
                    <div className="flex items-center gap-4 p-4">
                        <Avatar>
                            <AvatarImage src={image} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="text-left text-lg">{chatName}{chatId}</p>
                            {lastMessage && (
                                 <p className="text-left text-xs">{lastMessage.length < 30 ? lastMessage : `${lastMessage.slice(0,30)}...`}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Badge>{chatType}</Badge>
                    </div>
                </Button>
  )
}

export default ChatTab