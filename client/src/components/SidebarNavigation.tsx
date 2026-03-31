import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Building2, FolderKanban, Axis3d, BarChartHorizontal,
  Users, TrendingUp, DollarSign, FileText, Video, CalendarDays,
  FileBarChart, BarChart3, CreditCard, ChevronDown, ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  badge?: string;
}

const NavItem = ({ icon, label, href, active, badge }: NavItemProps) => (
  <Link href={href}>
    <span className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer gap-2 ${
      active
        ? "text-primary bg-primary/10 dark:bg-primary/20"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && <Badge className="bg-primary/10 text-primary border-0 text-xs px-1.5 py-0">{badge}</Badge>}
    </span>
  </Link>
);

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavGroup = ({ label, children, defaultOpen = true }: NavGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
        {label}
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
};

const SidebarNavigation = () => {
  const [location] = useLocation();

  const { data: recentProperties } = useQuery({
    queryKey: ['/api/properties'],
    select: (data: any[]) => data.slice(0, 3),
  });

  return (
    <aside className="hidden md:block w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1 py-3 px-2">
          <nav className="space-y-0.5">
            {/* Main */}
            <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" href="/" active={location === "/"} />
            <NavItem icon={<Building2 className="h-4 w-4" />} label="Properties" href="/properties" active={location.startsWith("/properties")} />
            <NavItem icon={<FolderKanban className="h-4 w-4" />} label="Projects" href="/projects" active={location.startsWith("/projects")} />
            <NavItem icon={<Axis3d className="h-4 w-4" />} label="3D Models" href="/models" active={location.startsWith("/models")} />

            <div className="pt-2" />

            {/* Sales & CRM */}
            <NavGroup label="Sales & CRM">
              <NavItem icon={<Users className="h-4 w-4" />} label="Lead CRM" href="/leads" active={location.startsWith("/leads")} />
              <NavItem icon={<TrendingUp className="h-4 w-4" />} label="Deal Pipeline" href="/deals" active={location.startsWith("/deals")} />
              <NavItem icon={<DollarSign className="h-4 w-4" />} label="Offer Management" href="/offers" active={location.startsWith("/offers")} />
            </NavGroup>

            {/* Client Experience */}
            <NavGroup label="Client Experience">
              <NavItem icon={<Video className="h-4 w-4" />} label="Live Open Houses" href="/open-houses" active={location.startsWith("/open-houses")} badge="Live" />
              <NavItem icon={<CalendarDays className="h-4 w-4" />} label="Calendar" href="/calendar" active={location.startsWith("/calendar")} />
              <NavItem icon={<FileBarChart className="h-4 w-4" />} label="Reports" href="/reports" active={location.startsWith("/reports")} />
            </NavGroup>

            {/* Intelligence */}
            <NavGroup label="Intelligence">
              <NavItem icon={<BarChart3 className="h-4 w-4" />} label="Market Data" href="/market-data" active={location.startsWith("/market-data")} />
              <NavItem icon={<BarChartHorizontal className="h-4 w-4" />} label="Analytics" href="/analytics" active={location.startsWith("/analytics")} />
            </NavGroup>

            {/* Operations */}
            <NavGroup label="Operations">
              <NavItem icon={<FileText className="h-4 w-4" />} label="Document Vault" href="/documents" active={location.startsWith("/documents")} />
              <NavItem icon={<CreditCard className="h-4 w-4" />} label="Subscription" href="/subscription" active={location.startsWith("/subscription")} />
            </NavGroup>

            {/* Recent Properties */}
            {recentProperties && recentProperties.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Recent Properties</div>
                <div className="space-y-0.5">
                  {recentProperties.map((property: any) => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          property.status === 'active' ? 'bg-green-500' : property.status === 'pending' ? 'bg-yellow-500' : 'bg-primary'
                        }`} />
                        <span className="truncate">{property.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-3">
            <h4 className="font-medium text-primary text-xs mb-1">Sync Status</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last synced: <span className="font-medium">2 min ago</span></p>
            <div className="flex items-center mt-1.5">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-xs dark:text-gray-300 text-gray-600">All devices synced</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
