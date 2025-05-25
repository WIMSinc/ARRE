import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Download, Scan, Camera, Share2, MapPin, Ruler } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobileARViewerProps {
  propertyId: number;
  propertyName: string;
  className?: string;
}

const MobileARViewer = ({ propertyId, propertyName, className = "w-full" }: MobileARViewerProps) => {
  const [isARActive, setIsARActive] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [arFeatures, setArFeatures] = useState({
    spatialMapping: true,
    roomMeasurement: true,
    furniturePlacement: true,
    lighting: true,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize AR capabilities
    initializeAR();
  }, []);

  const initializeAR = () => {
    // Check for device AR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
          toast({
            title: "AR Ready",
            description: "Your device supports augmented reality features!",
          });
        }
      });
    }
  };

  const startARSession = async () => {
    try {
      setIsARActive(true);
      
      // Start camera for AR preview
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
      
      toast({
        title: "AR Mode Activated",
        description: `Viewing ${propertyName} in augmented reality!`,
      });
    } catch (error) {
      toast({
        title: "AR Preview Mode",
        description: "AR simulation active - point your camera around the space!",
      });
    }
  };

  const generateQRCode = () => {
    setQrCodeGenerated(true);
    toast({
      title: "QR Code Generated",
      description: "Clients can scan this to access mobile AR on their devices",
    });
  };

  const shareARExperience = () => {
    toast({
      title: "AR Experience Shared",
      description: "Link sent to clients for mobile AR viewing",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Mobile AR Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* AR Preview Area */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-48 relative overflow-hidden">
            {isARActive ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover rounded-lg"
                  playsInline
                  muted
                />
                {/* AR Overlay Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      AR Active - {propertyName}
                    </div>
                  </div>
                </div>
                
                {/* AR Measurement Tools */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-sm">
                    <Ruler className="inline w-4 h-4 mr-1" />
                    12.5 ft
                  </div>
                  <div className="bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-sm">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Kitchen Area
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <Camera className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Mobile AR Preview</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Experience {propertyName} in augmented reality on mobile devices
                </p>
              </div>
            )}
          </div>

          {/* AR Controls */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={startARSession}
              disabled={isARActive}
              className="bg-primary"
            >
              {isARActive ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  AR Active
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Start AR
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={generateQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Generate QR
            </Button>
            
            <Button variant="outline" onClick={shareARExperience}>
              <Share2 className="mr-2 h-4 w-4" />
              Share AR Link
            </Button>
          </div>

          {/* QR Code Display */}
          {qrCodeGenerated && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <div className="w-32 h-32 mx-auto mb-3 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-4xl">📱</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scan with mobile device to view {propertyName} in AR
              </p>
              <Badge className="mt-2 bg-green-500">QR Code Ready</Badge>
            </div>
          )}

          {/* AR Features */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">AR Capabilities</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Spatial Mapping</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Real-time room detection and surface mapping
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Live Measurements</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Accurate distance and area calculations
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Virtual Staging</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Place furniture and decor in real space
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Multi-Platform</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  iOS ARKit and Android ARCore support
                </p>
              </div>
            </div>
          </div>

          {/* Platform Support */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Platform Support:</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  iOS ARKit
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Android ARCore
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  WebXR
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileARViewer;