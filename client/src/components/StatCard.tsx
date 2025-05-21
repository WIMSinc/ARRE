import { ReactNode } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Building2, 
  Axis3d, 
  FolderKanban, 
  PresentationIcon,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: 'building' | 'cube' | 'folder' | 'presentation';
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
  const getIcon = (): ReactNode => {
    switch (icon) {
      case 'building':
        return <Building2 className="text-primary" />;
      case 'cube':
        return <Axis3d className="text-secondary" />;
      case 'folder':
        return <FolderKanban className="text-accent" />;
      case 'presentation':
        return <PresentationIcon className="text-success" />;
      default:
        return <Building2 className="text-primary" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
          <span className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full">
            {getIcon()}
          </span>
        </div>
        <div>
          <p className="text-3xl font-bold dark:text-white">{value}</p>
          {change && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className={`${
                change.direction === 'up' 
                  ? 'text-success' 
                  : 'text-destructive'
              } flex items-center`}>
                {change.direction === 'up' ? (
                  <TrendingUp className="inline-block h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="inline-block h-3 w-3 mr-1" />
                )}
                {change.value}%
              </span> from last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
