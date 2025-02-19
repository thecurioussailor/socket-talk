import { Calendar, Home, Inbox, Settings } from "lucide-react"
import { IoHomeSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { IoChatbubbles } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { fetchProfile } from "@/pages/Profile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { toast, useToast } from "@/hooks/use-toast"
import { FaUser } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: IoMdHome,
  },
  {
    title: "All Chats",
    url: "/chats",
    icon: IoChatbubbles,
  },
  {
    title: "Personal",
    url: "/personal",
    icon: MdGroup,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: MdGroups,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: IoPersonAdd,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IoMdSettings,
  },
]

export function AppSidebar() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });
  const { toast } = useToast();
  const navigate = useNavigate();
 const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Logout Successful",
      description: "You have been logged out."
    });
    navigate('/signin');
 }
  if(isLoading){
    return <p className="text-white">Loading</p>
  }
  if(isError){
    return <p className="text-white">Error</p>
  }
  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-[#151718]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-white py-4 pl-4 pt-10">
            <div className="flex w-full items-center justify-between">
                <h1>Socket Talk</h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-8">
            <SidebarMenu className="text-white">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="p-1">
                  <SidebarMenuButton className="text-xl" asChild>
                    <Link to={item.url}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#151718] py-4">
        <div className="flex items-center justify-between rounded-lg h-14 p-4 hover:bg-zinc-800 cursor-pointer">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
              <Avatar>
                  <AvatarImage src={data?.profile?.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col pl-1 pr-2">
                <p className="text-left text-base text-white">{data?.profile?.name}</p>
                <p className="text-sm font-medium text-white">{data?.username}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger className="border-none text-white"><HiOutlineDotsVertical/></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-800 border-none">
                  <Link to={'/profile'}>
                    <DropdownMenuItem className="cursor-pointer focus:bg-zinc-700">
                        <div className="text-white flex items-center gap-2">
                          <FaUser/>
                          <span>Profile</span>
                        </div>
                    </DropdownMenuItem>
                  </Link>  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer focus:bg-zinc-700">
                        <div className="text-white flex items-center gap-2">
                          <FiLogOut />
                          <span>Logout</span>
                        </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
