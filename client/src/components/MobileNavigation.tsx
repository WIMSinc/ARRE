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
        <a className={`flex flex-col items-center justify-center ${
          location === "/" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
      </Link>
      
      <Link href="/properties">
        <a className={`flex flex-col items-center justify-center ${
          location.startsWith("/properties") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <Building2 className="h-5 w-5" />
          <span className="text-xs mt-1">Properties</span>
        </a>
      </Link>
      
      <Link href="/models">
        <a className={`flex flex-col items-center justify-center ${
          location.startsWith("/models") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <Axis3d className="h-5 w-5" />
          <span className="text-xs mt-1">3D Models</span>
        </a>
      </Link>
      
      <Link href="/projects">
        <a className={`flex flex-col items-center justify-center ${
          location.startsWith("/projects") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <FolderKanban className="h-5 w-5" />
          <span className="text-xs mt-1">Projects</span>
        </a>
      </Link>
      
      <Link href="/profile">
        <a className={`flex flex-col items-center justify-center ${
          location.startsWith("/profile") ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
