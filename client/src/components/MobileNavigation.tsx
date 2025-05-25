import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Axis3d,
  FolderKanban,
  User
} from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 px-2 sticky bottom-0">
      <Link href="/">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${
          location === "/" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </span>
      </Link>
      
      <Link href="/properties">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${
          location.startsWith("/properties") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <Building2 className="h-5 w-5" />
          <span className="text-xs mt-1">Properties</span>
        </span>
      </Link>
      
      <Link href="/models">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${
          location.startsWith("/models") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <Axis3d className="h-5 w-5" />
          <span className="text-xs mt-1">3D Models</span>
        </span>
      </Link>
      
      <Link href="/projects">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${
          location.startsWith("/projects") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <FolderKanban className="h-5 w-5" />
          <span className="text-xs mt-1">Projects</span>
        </span>
      </Link>
      
      <Link href="/profile">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${
          location.startsWith("/profile") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </span>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
