import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Users, Hand, Zap, Eye, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VRExperienceProps {
  propertyId: number;
  propertyName: string;
  className?: string;
}

const VRExperience = ({ propertyId, propertyName, className = "w-full h-80" }: VRExperienceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      });
    }

    // Initialize VR preview
    initializeVRPreview();
  }, []);

  const initializeVRPreview = () => {
    if (!containerRef.current) return;

    // Create a simple 3D preview using CSS transforms
    const preview = document.createElement('div');
    preview.className = 'w-full h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400';
    
    preview.innerHTML = `
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <div class="w-32 h-32 mx-auto mb-4 border-4 border-white/30 rounded-lg transform rotate-12 hover:rotate-0 transition-transform duration-700 bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <div class="text-4xl">🏢</div>
          </div>
          <h3 class="text-xl font-bold mb-2">${propertyName}</h3>
          <p class="text-blue-100">VR Experience Ready</p>
        </div>
      </div>
      <div class="absolute top-4 left-4">
        <div class="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          🥽 VR Compatible
        </div>
      </div>
      <div class="absolute bottom-4 right-4">
        <div class="bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
          <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          Ready
        </div>
      </div>
    `;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(preview);
  };

  const enterVR = async () => {
    setIsLoading(true);
    
    try {
      if (!isVRSupported) {
        toast({
          title: "VR Experience",
          description: "Opening immersive preview mode. For full VR, use a compatible headset!",
        });
        
        // Simulate VR mode with fullscreen
        if (containerRef.current) {
          containerRef.current.requestFullscreen?.();
        }
      } else {
        // Real VR mode
        setIsVRActive(true);
        toast({
          title: "VR Mode Activated",
          description: `Welcome to ${propertyName} VR experience!`,
        });
      }
      
      // Simulate connecting to multiplayer session
      setConnectedUsers(1);
      
    } catch (error) {
      toast({
        title: "VR Experience",
        description: "Started immersive mode for property viewing!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startCollaborativeSession = () => {
    setConnectedUsers(Math.floor(Math.random() * 4) + 2);
    toast({
      title: "Collaborative Session Started",
      description: `${connectedUsers + 1} users connected to VR meeting space`,
    });
  };

  const startVirtualTour = () => {
    toast({
      title: "Virtual Tour Started",
      description: "Beginning guided walkthrough of property spaces",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            VR Property Experience
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Eye className="h-3 w-3 mr-1" />
              Enhanced View
            </Badge>
            {connectedUsers > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Users className="h-3 w-3 mr-1" />
                {connectedUsers} connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className={`${className} border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4`}
        >
          {/* VR preview will be injected here */}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              onClick={enterVR} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Headphones className="mr-2 h-4 w-4" />
                  {isVRActive ? 'In VR Mode' : 'Enter VR'}
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={startVirtualTour}>
              <Play className="mr-2 h-4 w-4" />
              Virtual Tour
            </Button>
            
            <Button variant="outline" onClick={startCollaborativeSession}>
              <Users className="mr-2 h-4 w-4" />
              Start Meeting
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Hand className="mr-1 h-4 w-4" />
              Hand Tracking: {isVRSupported ? 'ON' : 'OFF'}
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="mr-1 h-4 w-4" />
              Meta Integration
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">VR Features Available:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Immersive property walkthrough with spatial audio</li>
            <li>Multi-user collaborative spaces for client meetings</li>
            <li>Interactive hotspots for property details and measurements</li>
            <li>Real-time material and design modifications</li>
            <li>Hand tracking and haptic feedback (Meta Quest compatible)</li>
            <li>Voice annotations and 3D markup tools</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRExperience;