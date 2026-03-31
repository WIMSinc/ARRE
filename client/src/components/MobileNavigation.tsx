import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, Users, TrendingUp, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Axis3d, FolderKanban, DollarSign, FileText, Video, CalendarDays, FileBarChart, BarChart3, CreditCard } from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  const moreLinks = [
    { href: "/projects", icon: FolderKanban, label: "Projects" },
    { href: "/models", icon: Axis3d, label: "3D Models" },
    { href: "/offers", icon: DollarSign, label: "Offers" },
    { href: "/documents", icon: FileText, label: "Documents" },
    { href: "/open-houses", icon: Video, label: "Open Houses" },
    { href: "/calendar", icon: CalendarDays, label: "Calendar" },
    { href: "/reports", icon: FileBarChart, label: "Reports" },
    { href: "/market-data", icon: BarChart3, label: "Market Data" },
    { href: "/subscription", icon: CreditCard, label: "Subscription" },
  ];

  return (
    <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 px-2 sticky bottom-0 z-50">
      <Link href="/">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${location === "/" ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
          <LayoutDashboard className="h-5 w-5" /><span className="text-xs mt-1">Home</span>
        </span>
      </Link>
      <Link href="/properties">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${location.startsWith("/properties") ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
          <Building2 className="h-5 w-5" /><span className="text-xs mt-1">Properties</span>
        </span>
      </Link>
      <Link href="/leads">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${location.startsWith("/leads") ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
          <Users className="h-5 w-5" /><span className="text-xs mt-1">Leads</span>
        </span>
      </Link>
      <Link href="/deals">
        <span className={`flex flex-col items-center justify-center cursor-pointer ${location.startsWith("/deals") ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
          <TrendingUp className="h-5 w-5" /><span className="text-xs mt-1">Deals</span>
        </span>
      </Link>
      <Popover>
        <PopoverTrigger asChild>
          <span className="flex flex-col items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400">
            <MoreHorizontal className="h-5 w-5" /><span className="text-xs mt-1">More</span>
          </span>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-56 p-2 mb-2">
          <div className="grid grid-cols-3 gap-2">
            {moreLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <span className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer text-xs transition-colors ${location.startsWith(link.href) ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                    <Icon className="h-5 w-5 mb-1" />{link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default MobileNavigation;
