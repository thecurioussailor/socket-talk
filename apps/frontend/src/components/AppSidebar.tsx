import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "All Chats",
    url: "/chats",
    icon: Inbox,
  },
  {
    title: "Personal",
    url: "/personal",
    icon: Inbox,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Inbox,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-[#151718]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-white py-4 pl-4 pt-10">
            <div className="flex w-full items-center justify-between">
                <h1>Socket Talk</h1>
                <SidebarTrigger/>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-8">
            <SidebarMenu className="text-white">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="p-1">
                  <SidebarMenuButton className="text-xl" asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#151718]">
        <Button className="flex items-center justify-start rounded-lg h-14 hover:bg-gray-500">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            </div>
            <div className="flex flex-col pl-3">
                <p className="text-left">name</p>
                <p>username</p>
            </div>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
