import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const FriendTab = ({username, onClick}: {username: string, onClick: () => void}) => {
   
  return (
    <div className="grid grid-cols-1">   
        <Button 
            onClick={onClick}
            className="flex justify-between items-center h-16 rounded-lg border border-zinc-700"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-lg">{username}</p>
                </div>
            </div>
        </Button>
    </div>
  )
}

export default FriendTab