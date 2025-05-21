import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  Building2, 
  FolderKanban, 
  Axis3d, 
  BarChartHorizontal, 
  Users
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <a 
        className={`flex items-center px-4 py-3 rounded-md font-medium transition-colors ${
          active 
            ? "text-primary dark:text-primary-foreground bg-blue-50 dark:bg-primary/20" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
};

const SidebarNavigation = () => {
  const [location] = useLocation();

  // Fetch recent properties
  const { data: recentProperties } = useQuery({
    queryKey: ['/api/properties'],
    select: (data) => data.slice(0, 3),
    enabled: true,
  });

  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1 py-4 px-3">
          <nav>
            <ul className="space-y-1">
              <li>
                <NavItem 
                  icon={<LayoutDashboard className="mr-3 h-5 w-5" />} 
                  label="Dashboard" 
                  href="/" 
                  active={location === "/"} 
                />
              </li>
              <li>
                <NavItem 
                  icon={<Building2 className="mr-3 h-5 w-5" />} 
                  label="Properties" 
                  href="/properties" 
                  active={location.startsWith("/properties")} 
                />
              </li>
              <li>
                <NavItem 
                  icon={<FolderKanban className="mr-3 h-5 w-5" />} 
                  label="Projects" 
                  href="/projects" 
                  active={location.startsWith("/projects")} 
                />
              </li>
              <li>
                <NavItem 
                  icon={<Axis3d className="mr-3 h-5 w-5" />} 
                  label="3D Models" 
                  href="/models" 
                  active={location.startsWith("/models")} 
                />
              </li>
              <li>
                <NavItem 
                  icon={<BarChartHorizontal className="mr-3 h-5 w-5" />} 
                  label="Analytics" 
                  href="/analytics" 
                  active={location.startsWith("/analytics")} 
                />
              </li>
              <li>
                <NavItem 
                  icon={<Users className="mr-3 h-5 w-5" />} 
                  label="Team" 
                  href="/team" 
                  active={location.startsWith("/team")} 
                />
              </li>
            </ul>
            
            <div className="mt-8 mb-4 px-4">
              <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Recent Properties
              </h5>
              <ul className="space-y-2">
                {recentProperties ? (
                  recentProperties.map((property) => (
                    <li key={property.id}>
                      <Link href={`/properties/${property.id}`}>
                        <a className="flex items-center py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-foreground">
                          <div className={`w-2 h-2 ${
                            property.status === 'active' 
                              ? 'bg-success' 
                              : property.status === 'pending' 
                                ? 'bg-warning' 
                                : 'bg-primary'
                          } rounded-full mr-2`}></div>
                          {property.name}
                        </a>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 dark:text-gray-400">Loading properties...</li>
                )}
              </ul>
            </div>
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-secondary/10 dark:bg-secondary/5 rounded-lg p-4">
            <h4 className="font-medium text-primary dark:text-primary-foreground mb-2">Sync Status</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last synced: <span className="font-medium">2 min ago</span>
            </p>
            <div className="flex items-center mt-2">
              <span className="inline-block w-2 h-2 bg-success rounded-full mr-2"></span>
              <span className="text-xs dark:text-gray-300">All devices up to date</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
