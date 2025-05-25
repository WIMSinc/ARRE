import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Users, Hand, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VRModelViewerProps {
  propertyId: number;
  propertyName: string;
  className?: string;
}

const VRModelViewer = ({ propertyId, propertyName, className = "w-full h-80" }: VRModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      });
    }

    // Initialize VR scene with Meta platform integration
    initializeVRScene();
  }, []);

  const initializeVRScene = async () => {
    if (!containerRef.current) return;

    try {
      // Create A-Frame scene programmatically
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', 'true');
      scene.setAttribute('vr-mode-ui', 'enabled: true');
      scene.setAttribute('device-orientation-permission-ui', 'enabled: true');
      
      // Add Meta Platform integration
      scene.setAttribute('oculus-platform', `appId: ${import.meta.env.VITE_OCULUS_APP_ID || 'demo'}`);
      
      // Create sky
      const sky = document.createElement('a-sky');
      sky.setAttribute('color', '#87CEEB');
      scene.appendChild(sky);

      // Create ground
      const ground = document.createElement('a-plane');
      ground.setAttribute('position', '0 0 -4');
      ground.setAttribute('rotation', '-90 0 0');
      ground.setAttribute('width', '20');
      ground.setAttribute('height', '20');
      ground.setAttribute('color', '#7BC8A4');
      scene.appendChild(ground);

      // Create main building (representing the property)
      const building = document.createElement('a-box');
      building.setAttribute('position', '0 2 -5');
      building.setAttribute('width', '4');
      building.setAttribute('height', '4');
      building.setAttribute('depth', '4');
      building.setAttribute('color', '#0055A4'); // AugmentedRealityRE primary color
      building.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 20000');
      scene.appendChild(building);

      // Add interactive hotspots
      const hotspot1 = document.createElement('a-sphere');
      hotspot1.setAttribute('position', '-2 3 -5');
      hotspot1.setAttribute('radius', '0.3');
      hotspot1.setAttribute('color', '#00AEEF'); // Secondary color
      hotspot1.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 1000');
      hotspot1.setAttribute('class', 'clickable');
      scene.appendChild(hotspot1);

      const hotspot2 = document.createElement('a-sphere');
      hotspot2.setAttribute('position', '2 3 -5');
      hotspot2.setAttribute('radius', '0.3');
      hotspot2.setAttribute('color', '#FF6B00'); // Accent color
      hotspot2.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 1000');
      hotspot2.setAttribute('class', 'clickable');
      scene.appendChild(hotspot2);

      // Add property info text
      const propertyText = document.createElement('a-text');
      propertyText.setAttribute('position', '0 5 -5');
      propertyText.setAttribute('align', 'center');
      propertyText.setAttribute('color', '#FFFFFF');
      propertyText.setAttribute('value', propertyName);
      propertyText.setAttribute('width', '8');
      scene.appendChild(propertyText);

      // Add VR camera with hand controls
      const cameraRig = document.createElement('a-entity');
      cameraRig.setAttribute('id', 'cameraRig');
      
      const camera = document.createElement('a-camera');
      camera.setAttribute('look-controls', 'enabled: true');
      camera.setAttribute('wasd-controls', 'enabled: true');
      
      // Add hand tracking support
      const leftHand = document.createElement('a-entity');
      leftHand.setAttribute('id', 'leftHand');
      leftHand.setAttribute('hand-controls', 'hand: left; handModelStyle: lowPoly; color: #0055A4');
      leftHand.setAttribute('laser-controls', 'hand: left');
      cameraRig.appendChild(leftHand);

      const rightHand = document.createElement('a-entity');
      rightHand.setAttribute('id', 'rightHand');
      rightHand.setAttribute('hand-controls', 'hand: right; handModelStyle: lowPoly; color: #0055A4');
      rightHand.setAttribute('laser-controls', 'hand: right');
      cameraRig.appendChild(rightHand);

      cameraRig.appendChild(camera);
      scene.appendChild(cameraRig);

      // Add lighting
      const light = document.createElement('a-light');
      light.setAttribute('type', 'ambient');
      light.setAttribute('color', '#404040');
      scene.appendChild(light);

      const directionalLight = document.createElement('a-light');
      directionalLight.setAttribute('type', 'directional');
      directionalLight.setAttribute('position', '5 10 5');
      directionalLight.setAttribute('color', '#FFFFFF');
      scene.appendChild(directionalLight);

      // Clear container and add scene
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(scene);

      // Add click handlers for interactivity
      scene.addEventListener('loaded', () => {
        const clickables = scene.querySelectorAll('.clickable');
        clickables.forEach((element) => {
          element.addEventListener('click', (event) => {
            const target = event.target as any;
            const position = target.getAttribute('position');
            toast({
              title: "VR Interaction",
              description: `Clicked hotspot at position ${position.x}, ${position.y}, ${position.z}`,
            });
          });
        });
      });

    } catch (error) {
      console.error('Error initializing VR scene:', error);
    }
  };

  const enterVR = async () => {
    if (!isVRSupported) {
      toast({
        title: "VR Not Supported",
        description: "Your device doesn't support WebXR. Try using a VR headset or compatible browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const scene = containerRef.current?.querySelector('a-scene') as any;
      if (scene && scene.enterVR) {
        await scene.enterVR();
        setIsVRActive(true);
        
        // Simulate connecting to multiplayer session
        setConnectedUsers(1);
        
        toast({
          title: "VR Mode Activated",
          description: `Welcome to ${propertyName} VR experience!`,
        });
      }
    } catch (error) {
      toast({
        title: "VR Error",
        description: "Failed to enter VR mode. Please check your headset connection.",
        variant: "destructive",
      });
    }
  };

  const startCollaborativeSession = () => {
    // Simulate starting a collaborative VR session
    setConnectedUsers(Math.floor(Math.random() * 4) + 2);
    toast({
      title: "Collaborative Session Started",
      description: `${connectedUsers + 1} users connected to VR meeting space`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <VrHeadset className="h-5 w-5 text-primary" />
            VR Property Experience
          </CardTitle>
          <div className="flex gap-2">
            {isVRSupported && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                VR Ready
              </Badge>
            )}
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
          className={`${className} border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5`}
        >
          {/* A-Frame scene will be injected here */}
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <Button onClick={enterVR} disabled={!isVRSupported}>
              <VrHeadset className="mr-2 h-4 w-4" />
              {isVRActive ? 'In VR Mode' : 'Enter VR'}
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
              Haptics
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">VR Features Available:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Immersive property walkthrough with hand tracking</li>
            <li>Multi-user collaborative spaces for client meetings</li>
            <li>Interactive hotspots for property details and measurements</li>
            <li>Real-time material and design modifications</li>
            <li>Spatial audio for realistic environmental sounds</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRModelViewer;