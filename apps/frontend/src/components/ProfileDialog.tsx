import { UserDetails } from "@/pages/Profile";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { IoClose } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "./ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ProfileData {
    name: string;
    avatar: string;
    coverImage: string;
    bio: string;
    languages: string[];
    location: string;
    instagram: string;
    x: string;
    discord: string;
    interests: string[];
}

const updateProfile = async (profileData: ProfileData) => {
    const response = await axios.put(`${BACKEND_URL}/users/profile`, profileData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    return response.data
}

const ProfileDialog = ({actionType, data , onClose}: {actionType: "create" | "edit", data: UserDetails, onClose: () => void}) => {
    
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const defaultProfileData: ProfileData = {
        name : "",
        avatar : "",
        coverImage : "",
        bio : "",
        languages : [],
        location : "",
        instagram : "",
        x : "",
        discord : "",
        interests : [],
    } 
    const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
    useEffect(() => {
        setProfileData(actionType === "edit" && data?.profile ? { ...data.profile } : defaultProfileData);
    }, [actionType, data]);

    const {mutate, isPending} = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast({
                title: 'Profile Updated',
                description: 'Your profile details has been successfully updated'
            })
            queryClient.invalidateQueries({
                queryKey: ["profile"]
            });
            onClose();
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(e.target)
        setProfileData((prev) => ({
            ...prev,
            [name]: name === "languages" || name === "interests" ? value.split(",") : value
        }));
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate(profileData);
    }
    return (
    <section>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg p-6 w-2/3 border border-zinc-600 bg-[#191919]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-200">
                    {actionType === "create" ? "Create Your Profile" : "Edit Your Profile"}
                </h2>
                <Button
                    type="button"
                    className="bg-transparent border h-2 w-2 p-3 border-zinc-600"
                    onClick={onClose}
                >
                    <IoClose />
                </Button>
              </div>
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-2 text-white h-96">
                <ScrollArea className="h-full px-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Name
                        </Label>
                        <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="border-none focus-visible:ring-zinc-600"
                        value={profileData.name}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Avatar Link
                        </Label>
                    <Input
                        name="avatar"
                        type="text"
                        placeholder="Avatar Link"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.avatar: ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Cover Image Link
                        </Label>
                    <Input
                        name="coverImage"
                        type="text"
                        placeholder="Cover Image Link"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.coverImage: ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Bio
                        </Label>
                    <Textarea 
                        name="bio"
                        placeholder="Bio"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.bio : ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                           languages
                        </Label>
                    <Input
                        name="languages"
                        type="text"
                        placeholder="languages"
                        className="border-none focus-visible:ring-zinc-600"
                        value={profileData.languages.join(",")}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Instagram url
                        </Label>
                    <Input
                        name="instagram"
                        type="text"
                        placeholder="Instagram url"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.instagram: ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            X url
                        </Label>
                    <Input
                        name="x"
                        type="text"
                        placeholder="X url"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.x: ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Discord
                        </Label>
                    <Input
                        name="discord"
                        type="text"
                        placeholder="Discord"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.discord: ""}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Interests
                        </Label>
                    <Input
                        name="interests"
                        type="text"
                        placeholder="Interests"
                        className="border-none focus-visible:ring-zinc-600"
                        value={profileData.interests.join(",")}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="flex justify-center space-x-2 w-full">
                    <Button type="submit" disabled={isPending} className="border border-zinc-600 bg-zinc-800 hover:bg-zinc-700">
                        {isPending ? "Saving..." : actionType === "create" ? "Create" : "Save"}
                    </Button>
                    </div>
                </ScrollArea>
              </form>
            </div>
          </div>
    </section>
  )
}

export default ProfileDialog