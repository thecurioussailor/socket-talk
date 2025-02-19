import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import cover from "/cover.jpg";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Languages, LocateIcon, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { IoClose } from "react-icons/io5";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchUserProfile = async (id: string) => {
    const response = await axios.get(`${BACKEND_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data;

}

const UserProfileCard = ({id, onClose}: {id: string | null, onClose: () => void}) => {

    const { data, isError, isLoading } = useQuery({
        queryKey: ["users", id],
        queryFn: () => fetchUserProfile(id!),
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
    <section className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-90 z-50">
        <div className=" border w-2/5 rounded-xl border-zinc-700 p-6 bg-[#191919]">
            <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-zinc-200">
                                User Profile
                            </h2>
                            <Button
                                type="button"
                                className="bg-transparent border h-2 w-2 p-3 border-zinc-600"
                                onClick={onClose}
                            >
                                <IoClose />
                            </Button>
                          </div>
            <div className="relative flex justify-center">
                <div className="overflow-clip h-36 w-full relative">
                    <img className=" object-cover" src={data.profile.coverImage}/>
                    <p className="z-10 absolute text-white top-1 right-4">
                        <Badge>username: {data?.username}</Badge>
                    </p>
                </div>
                <div className="absolute -bottom-9">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={data?.profile?.avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="pt-12 px-4">
                <h1 className="text-xl font-semibold text-center">{data.profile.name}</h1>
                <div className="flex flex-col gap-10 justify-start">
                    <p className="text-center">{data.profile.bio}</p>
                    <div className="flex justify-center gap-8">
                        <div className="flex gap-1">
                            <LocateIcon/>
                            <p>{data.profile.location}</p>
                        </div>
                        <div className="flex gap-1">
                            <Languages/>
                            <p>English</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
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
        </div>
    </section>
  )
}

export default UserProfileCard