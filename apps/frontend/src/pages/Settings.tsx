import FriendTab from "@/components/FriendTab";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import ChatTab from "@/components/ChatTab";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const Settings = () => {
   
    
  return (
    <section className="bg-[#242627] text-white rounded-lg px-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Settings</h1>
    </header>
    <div>
        <Tabs defaultValue="friends" className="w-full">
            <TabsList>
                <TabsTrigger value="friends">Themes</TabsTrigger>
                <TabsTrigger value="pendingrequest">Change Password</TabsTrigger>
                <TabsTrigger value="sentrequest">Invites Sent</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="w-full h-auto py-2">
                
            </TabsContent>
            <TabsContent value="pendingrequest">Change your password here.</TabsContent>
            <TabsContent value="sentrequest">Change your password here.</TabsContent>
        </Tabs>
    </div>
</section>
  )
}

export default Settings