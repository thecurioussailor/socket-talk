import { UserDetails } from "@/pages/Profile";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { IoClose } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "./ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"

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

const ProfileDialog = ({actionType, data , onClose}: {actionType: "create" | "edit", data: UserDetails, onClose: () => void}) => {
    const handleFormSubmit = () => {

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
                        type="text"
                        placeholder="Name"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.name : ""}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Avatar Link
                        </Label>
                    <Input
                        type="text"
                        placeholder="Avatar Link"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.avatar: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Cover Image Link
                        </Label>
                    <Input
                        type="text"
                        placeholder="Cover Image Link"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.coverImage: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Bio
                        </Label>
                    <Textarea 
                        placeholder="Bio"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.bio : ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                           languages
                        </Label>
                    <Input
                        type="text"
                        placeholder="languages"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.languages: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Instagram url
                        </Label>
                    <Input
                        type="text"
                        placeholder="Instagram url"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.instagram: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            X url
                        </Label>
                    <Input
                        type="text"
                        placeholder="X url"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.x: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Discord
                        </Label>
                    <Input
                        type="text"
                        placeholder="Discord"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.discord: ""}
                    />
                    </div>
                    <div className="flex flex-col gap-2 pr-6 pl-2 pb-6">
                        <Label
                            className="text-xs pl-3 text-gray-400"
                        >
                            Interests
                        </Label>
                    <Input
                        type="text"
                        placeholder="Interests"
                        className="border-none focus-visible:ring-zinc-600"
                        defaultValue={actionType === "edit" ? data?.profile?.interests: ""}
                    />
                    </div>
                    <div className="flex justify-center space-x-2 w-full">
                    <Button type="submit" className="border border-zinc-600 bg-zinc-800 hover:bg-zinc-700">
                        {actionType === "create" ? "Create" : "Save"}
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