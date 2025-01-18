import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { SearchIcon } from "lucide-react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const fetchChats = () => {
    return axios.get(`${BACKEND_URL}/chats`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
}
const Chats = () => {
    const { data, isLoading, isError} = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats
    })

    if(isLoading){
        return <div>Page is loading</div>
    }
    if(isError){
        return <div>Error has occured.</div>
    }
    console.log(data?.data)
  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
        <header className="p-4 flex justify-between text-2xl font-semibold">
            <h1>All Chats</h1>
            <div className="flex items-center gap-2 border rounded-lg p-1 justify-between">
                <Input className="w-56 outline-none border-none focus:outline-none focus:border-none"/>
                <Button>
                    <SearchIcon/>
                </Button>
            </div>
        </header>
        <div className="grid grid-flow-col grid-cols-2 justify-start gap-2 w-full">
            <div className="flex flex-col gap-2">
            {data?.data.map(chat => (
                <Button className="flex justify-start items-center h-24 border border-zinc-700" key={chat.id}>
                    <div className="flex items-center gap-4 p-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-left">{chat.name}</p>
                            <p className="text-left">{chat.messages[0]?.content}</p>
                        </div>
                    </div>
                </Button>
            ))}
            </div>
            <div>
                message
            </div>
        </div>
    </section>
  )
}

export default Chats