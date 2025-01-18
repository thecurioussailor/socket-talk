import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SearchIcon } from "lucide-react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Friends = () => {

    const {data, isError, isLoading} = useQuery({
        queryKey: ["friends"],
        queryFn: () => {
            return axios.get(`${BACKEND_URL}/friends`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        }
    })
  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Friends</h1>
        <div className="flex items-center gap-2 border rounded-lg p-1 justify-between">
            <Input className="w-56 outline-none border-none focus:outline-none focus:border-none"/>
            <Button>
                <SearchIcon/>
            </Button>
        </div>
    </header>
    <div className="grid grid-cols-2 gap-2">   
        <div className="flex flex-col justify-start gap-2">
            {data?.data.map(friend => (
                <Button className="flex flex-col justify-start items-start h-32" key={friend.id}>
                    <p className="text-left">{friend.username}</p>
                </Button>
            ))}
        </div>
        <div>
            friend profile
        </div>
    </div>
</section>
  )
}

export default Friends