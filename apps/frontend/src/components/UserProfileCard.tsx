import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import cover from "/cover.jpg";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Languages, LocateIcon, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchProfile = async (id: string) => {
    const response = await axios.get(`${BACKEND_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data;

}

const UserProfileCard = ({id}: {id: string | null}) => {

    const { data, isError, isLoading } = useQuery({
        queryKey: ["users", id],
        queryFn: () => fetchProfile(id!),
        enabled: !!id,
      });

      if (isLoading) {
        return <p>Loading...</p>;
      }
    
      // Show error state
      if (isError) {
        return <p>Failed to load profile</p>;
      }

  return (
    <section className="flex flex-col justify-between items-center rounded-lg border bg-[#191919] border-zinc-700 overflow-clip pb-4">
        <div className="relative">
            <div className="overflow-clip h-36 rounded-t-lg relative">
                <img src={cover}/>
                <p className="z-50 absolute text-white top-1 right-4"><Badge>username: {data?.username}</Badge></p>
            </div>
            <div className="absolute -bottom-9 left-64">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
        <div className="pt-12 px-4 w-full">
            <h1 className="text-xl font-semibold text-center">Ashutosh Sagar</h1>
            <div className="flex flex-col gap-10 justify-start">
                <p className="text-center">Building a Google review management system. Passionate about tech, development, and creating seamless user experiences.</p>
                <div className="flex justify-center gap-8">
                    <div className="flex gap-1">
                        <LocateIcon/>
                        <p>Delhi</p>
                    </div>
                    <div className="flex gap-1">
                        <Languages/>
                        <p>English</p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button className="bg-zinc-800 rounded-2xl h-10 hover:bg-zinc-700 w-32">Message</Button>
                    <div className="flex items-center gap-5">
                        <Twitter/>
                        <Instagram/>
                    </div>
                </div>
                <div className="flex flex-col gap-4 border rounded-2xl p-4 bg-zinc-800 border-zinc-700">
                    <h3 className="font-medium uppercase">Interests</h3>
                    <div className="flex flex-wrap gap-4">
                        <Badge className="h-9 rounded-2xl bg-zinc-800 border-zinc-700">Climate Chnage</Badge>
                        <Badge className="h-9 rounded-2xl bg-zinc-800 border-zinc-700">Weight Lifting</Badge>
                        <Badge className="h-9 rounded-2xl bg-zinc-800 border-zinc-700">Cricket</Badge>
                        <Badge className="h-9 rounded-2xl bg-zinc-800 border-zinc-700">Bitcoin and Ethreum only</Badge>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default UserProfileCard