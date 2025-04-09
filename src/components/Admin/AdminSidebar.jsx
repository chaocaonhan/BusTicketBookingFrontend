import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, Settings, Bus } from "lucide-react";

const AdminSidebar = () => {
  const menuItems = [
    { icon: Home, label: "Tổng quan", path: "/dashboard" },
    { icon: Users, label: "Quản lý người dùng", path: "/users" },
    { icon: Bus, label: "Quản lý tuyến xe", path: "/bus-routes" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-lg font-semibold">Quản trị viên</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary font-medium"
                          : "text-sidebar-foreground"
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
