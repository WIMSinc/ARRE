import { Project, TeamMember } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  // Fetch team members for this project
  const { data: teamMembers = [] } = useQuery({
    queryKey: [`/api/team-members?projectId=${project.id}`],
    enabled: !!project.id,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 h-full">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Project Details</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project Progress</h4>
          <Progress value={project.progress} className="h-2.5" />
          <div className="flex justify-between mt-1 text-xs dark:text-gray-300">
            <span>{project.progress}% Complete</span>
            <span>Est. Completion: {project.estimatedCompletion}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project Team</h4>
          <div className="flex -space-x-2 overflow-hidden mb-2">
            {teamMembers.slice(0, 3).map((member: TeamMember) => (
              <Avatar key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 3 && (
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 text-xs">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
              <p className="font-semibold dark:text-white">${(project.budget / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">ROI (est.)</p>
              <p className="font-semibold dark:text-white">{project.roi}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Time Saved</p>
              <p className="font-semibold dark:text-white">{project.timeSaved} days</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Design Changes</p>
              <p className="font-semibold dark:text-white">{project.designChanges}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Activity</h4>
          <div className="space-y-2">
            <div className="text-xs">
              <p className="font-medium dark:text-white">3D model updated</p>
              <p className="text-gray-500 dark:text-gray-400">Today, 10:42 AM</p>
            </div>
            <div className="text-xs">
              <p className="font-medium dark:text-white">Client presentation scheduled</p>
              <p className="text-gray-500 dark:text-gray-400">Yesterday, 4:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
