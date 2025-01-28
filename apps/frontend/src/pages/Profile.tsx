import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Languages, LocateIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import ProfileDialog from "@/components/ProfileDialog";
  
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export interface Profile {
    id: string,
    name: string,
    avatar: string,
    coverImage: string,
    bio: string,
    languages: string[];
    location: string,
    instagram: string,
    x: string,
    discord: string,
    interests: string[],
    userId: string
}

export interface UserDetails {
    id: string,
    username: string,
    createdAt: string,
    updatedAt: string,
    profile: Profile
}
export const fetchProfile = async (): Promise<UserDetails> => {
    const response = await axios.get(`${BACKEND_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data)
    return response.data;

}

const Profile = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"create" | "edit">("create");
    const { data, isError, isLoading } = useQuery<UserDetails | null>({
        queryKey: ["profile"],
        queryFn: fetchProfile
      });

      if (isLoading) {
        return <p className="text-white">Loading...</p>;
      }
    
      // Show error state
      if (isError) {
        return <p className="text-white">Failed to load profile</p>;
      }

  return (
    <section className="flex flex-col justify-between items-center rounded-lg border bg-[#191919] border-zinc-700 overflow-clip pb-4 h-full">
        <div className="relative w-full flex justify-center">
            <div className="overflow-clip h-36 w-full rounded-t-lg relative">
                <img className="w-full object-cover" src={data?.profile?.coverImage}/>
                <div className="z-10 absolute text-white top-1 right-4">
                    <Badge>{data?.username}</Badge>
                </div>
                <Button 
                    onClick={() => {
                        setActionType('edit');
                        setIsDialogOpen(true);
                    }}
                    className="absolute bottom-2 right-6 text-white rounded-full p-2 bg-zinc-800"
                >
                    <FaUserEdit size={20}/>
                </Button>
            </div>
            <div className="absolute -bottom-12">
                <Avatar className="h-28 w-28">
                    <AvatarImage src={data?.profile?.avatar} className="cover"/>
                    <AvatarFallback className="text-4xl font-semibold">{data?.username.slice(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
        </div>
        {
            data?.profile ? (<div className="pt-12 px-4 w-full">
            <h1 className="text-xl font-semibold text-center text-white">{data?.profile?.name}</h1>
            <div className="flex flex-col gap-10 justify-start">
                <p className="text-center text-white">{data?.profile?.bio}</p>
                <div className="flex justify-center gap-8">
                    <div className="flex gap-1 text-white">
                        <LocateIcon/>
                        <p>{data?.profile?.location}</p>
                    </div>
                    <div className="flex gap-1 text-white">
                        <Languages/>
                        <p>{data?.profile?.languages[0]}</p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-10 text-white">
                        <Link to={''}><FaXTwitter size={30}/></Link>
                        <Link to={''}><FaDiscord size={40}/></Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4 border rounded-2xl p-4 bg-zinc-800 border-zinc-700">
                    <h3 className="font-medium uppercase text-white">Interests</h3>
                    <div className="flex flex-wrap gap-4">
                        {data?.profile?.interests.map(interest => (
                            <Badge className="h-9 rounded-2xl bg-zinc-800 border-zinc-700">{interest}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>): (
            <div className="text-white">
                <Button 
                    onClick={() => {
                        setActionType("create");
                        setIsDialogOpen(true);
                    }}
                    className="bg-zinc-800"
                >
                    <FaUserEdit />
                    Create Your Profile
                </Button>
            </div>
        )}
        {isDialogOpen && data && (
            <ProfileDialog actionType={actionType} data={data} onClose={() => setIsDialogOpen(false)}/>
        )}
    </section>
  )
}

export default Profile