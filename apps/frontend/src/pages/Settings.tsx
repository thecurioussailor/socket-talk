import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const changePassword = async (passwordData: { oldPassword: string, newPassword: string}) => {
    const response = await axios.put(`${BACKEND_URL}/users/reset-password`, passwordData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data;
}

const Settings = () => {
   
    const { toast } = useToast();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {  
            toast({
                title: "Password Change Successfull",
                description: "Your password has been changed."
            })
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: () => {
            toast({
                title: "Error while changing Password",
                description: "Your password cannot be changed please try after sometimes"
            })
        }
    })

      const handleFormSubmit = (e: FormEvent) => {
            e.preventDefault();
            if(!oldPassword || !newPassword || !confirmPassword){
                toast({
                    title: "Missing Fields",
                    description: "Please fill in all fields",
                    variant: "destructive"
                })
                return;
            }

            if(newPassword !== confirmPassword){
                toast({
                    title: "Passwords Do Not Match",
                    description: "Please fill correct passwords",
                    variant: "destructive"
                });
                return;
            }
            mutate({oldPassword, newPassword});
        }
    
  return (
    <section className="bg-[#242627] text-white rounded-lg px-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Settings</h1>
    </header>
    <div>
        <div className="px-4 flex flex-col gap-4">
            <h1 className="font-semibold">Change Password</h1>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 w-96 ">
                <Input 
                    type="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border-none focus-visible:ring-zinc-600" 
                    placeholder="Old Password"
                />
                <Input 
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-none focus-visible:ring-zinc-600" 
                    placeholder="New Password"
                />
                <Input 
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-none focus-visible:ring-zinc-600" 
                    placeholder="Confirm New Password"
                />
                <div>
                    <Button 
                        type="submit" 
                        className="border border-zinc-600 bg-zinc-950 hover:bg-zinc-900"
                        disabled={isPending}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    </div>
</section>
  )
}

export default Settings