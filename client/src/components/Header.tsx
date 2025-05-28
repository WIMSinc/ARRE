import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Sun, Moon, Settings, Bell, HelpCircle, LogOut } from "lucide-react";
import ARRELogo from "@/assets/ARRE Logo.png";

const Header = () => {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <img
            src={ARRELogo}
            alt="ARRE Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-primary dark:text-primary text-xl">ARRE</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Augmented Reality Real Estate</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600" />
            ) : (
              <Sun className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="hidden md:inline text-sm font-medium dark:text-gray-300">
                {user?.fullName}
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="md:hidden" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
