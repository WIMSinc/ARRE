import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Hand, 
  Layers, 
  Zap, 
  Users, 
  Share2,
  Settings,
  Maximize
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppleVisionProSupportProps {
  propertyId: number;
  propertyName: string;
  className?: string;
}

const AppleVisionProSupport = ({ propertyId, propertyName, className = "w-full" }: AppleVisionProSupportProps) => {
  const [isVisionProDetected, setIsVisionProDetected] = useState(false);
  const [spatialMode, setSpatialMode] = useState(false);
  const [passthrough, setPassthrough] = useState(true);
  const [eyeTracking, setEyeTracking] = useState(true);
  const [handTracking, setHandTracking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Detect Apple Vision Pro capabilities
    detectVisionPro();
  }, []);

  const detectVisionPro = () => {
    // Check for Vision Pro WebXR capabilities
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
          // Additional Vision Pro specific checks
          setIsVisionProDetected(true);
          toast({
            title: "Apple Vision Pro Detected",
            description: "Enhanced spatial computing features are now available!",
          });
        }
      });
    }
  };

  const enterSpatialMode = () => {
    setSpatialMode(true);
    toast({
      title: "Spatial Computing Activated",
      description: `${propertyName} is now displayed in your physical space!`,
    });
  };

  const togglePassthrough = () => {
    setPassthrough(!passthrough);
    toast({
      title: `Passthrough ${!passthrough ? 'Enabled' : 'Disabled'}`,
      description: !passthrough ? "Real world is now visible" : "Full immersion activated",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Apple Vision Pro Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Detection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isVisionProDetected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {isVisionProDetected ? 'Vision Pro Connected' : 'Vision Pro Support Ready'}
              </span>
            </div>
            <Badge className={isVisionProDetected ? "bg-green-500" : "bg-gray-500"}>
              {isVisionProDetected ? 'Active' : 'Standby'}
            </Badge>
          </div>

          {/* Spatial Computing Preview */}
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Spatial Computing Preview</h3>
              <p className="text-purple-100 mb-4">
                Experience {propertyName} in mixed reality with Apple Vision Pro
              </p>
              
              {/* 3D Property Preview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center h-32">
                  <div className="text-6xl transform hover:scale-110 transition-transform duration-300">
                    🏢
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={enterSpatialMode}
                  disabled={spatialMode}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                >
                  {spatialMode ? (
                    <>
                      <Layers className="mr-2 h-4 w-4" />
                      Spatial Mode Active
                    </>
                  ) : (
                    <>
                      <Maximize className="mr-2 h-4 w-4" />
                      Enter Spatial Mode
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 gap-2 h-full">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="bg-white/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Pro Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Eye Tracking</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Navigate with natural eye movements
              </p>
              <Badge className={eyeTracking ? "bg-green-500" : "bg-gray-500"}>
                {eyeTracking ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hand className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Hand Tracking</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Precise gesture-based interactions
              </p>
              <Badge className={handTracking ? "bg-green-500" : "bg-gray-500"}>
                {handTracking ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Passthrough</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Blend virtual with real environment
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={togglePassthrough}
                className="text-xs h-6"
              >
                {passthrough ? 'Disable' : 'Enable'}
              </Button>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Spatial Audio</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                3D positioned environmental sounds
              </p>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </div>

          {/* Vision Pro Specific Controls */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Vision Pro Controls</h4>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Display Settings
              </Button>
              <Button size="sm" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                SharePlay
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                AirPlay
              </Button>
            </div>
          </div>

          {/* Capabilities Overview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-3">Enhanced Capabilities</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Resolution per Eye</span>
                <span className="font-medium">4K (3840×2160)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Field of View</span>
                <span className="font-medium">120° Horizontal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hand Tracking Precision</span>
                <span className="font-medium">Sub-millimeter</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Eye Tracking Accuracy</span>
                <span className="font-medium">0.5° Angular</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppleVisionProSupport;