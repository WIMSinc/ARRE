import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Camera,
  MapPin,
  Clock,
  User,
  Headphones,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TourWaypoint {
  id: string;
  name: string;
  description: string;
  duration: number;
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  narration: string;
  highlights: string[];
}

interface VirtualTour {
  id: string;
  name: string;
  description: string;
  duration: number;
  narrator: string;
  waypoints: TourWaypoint[];
  thumbnailUrl?: string;
}

interface VirtualPropertyToursProps {
  propertyId: number;
  propertyName: string;
}

const VirtualPropertyTours = ({ propertyId, propertyName }: VirtualPropertyToursProps) => {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const tours: VirtualTour[] = [
    {
      id: 'tour_1',
      name: 'Executive Overview Tour',
      description: 'A comprehensive walkthrough highlighting key business features and amenities',
      duration: 480, // 8 minutes
      narrator: 'Sarah Chen, Senior Property Consultant',
      waypoints: [
        {
          id: 'wp_1',
          name: 'Grand Entrance Lobby',
          description: 'Welcome to the impressive two-story lobby with marble finishes',
          duration: 60,
          position: { x: 0, y: 0, z: 0 },
          lookAt: { x: 0, y: 2, z: 10 },
          narration: 'Welcome to Metropolitan Plaza. As you enter through the grand lobby, notice the premium marble finishes and soaring 20-foot ceilings that create an impressive first impression for your clients and visitors.',
          highlights: ['Marble finishes', '20-foot ceilings', 'Reception desk', 'Seating area']
        },
        {
          id: 'wp_2',
          name: 'Main Conference Room',
          description: 'State-of-the-art conference facility with advanced AV systems',
          duration: 90,
          position: { x: 15, y: 0, z: 5 },
          lookAt: { x: 20, y: 1.5, z: 5 },
          narration: 'This flagship conference room seats 20 people comfortably and features cutting-edge audiovisual technology, perfect for board meetings and client presentations. The floor-to-ceiling windows provide natural light while maintaining privacy.',
          highlights: ['Seats 20 people', 'Advanced AV system', 'Natural lighting', 'Privacy glass']
        },
        {
          id: 'wp_3',
          name: 'Open Office Space',
          description: 'Flexible workspace designed for modern business needs',
          duration: 75,
          position: { x: -10, y: 0, z: 10 },
          lookAt: { x: -5, y: 1.5, z: 15 },
          narration: 'The open office space offers maximum flexibility with modular workstations that can be reconfigured as your business grows. The abundant natural light and modern HVAC system ensure a comfortable working environment.',
          highlights: ['Modular workstations', 'Natural light', 'Modern HVAC', 'Flexible layout']
        },
        {
          id: 'wp_4',
          name: 'Executive Offices',
          description: 'Private offices for senior leadership with premium finishes',
          duration: 85,
          position: { x: 25, y: 0, z: -5 },
          lookAt: { x: 30, y: 1.5, z: -5 },
          narration: 'The executive wing features six private offices with premium finishes, built-in storage, and panoramic city views. Each office includes a private meeting area and direct access to the executive conference room.',
          highlights: ['6 private offices', 'City views', 'Built-in storage', 'Meeting areas']
        },
        {
          id: 'wp_5',
          name: 'Rooftop Terrace',
          description: 'Outdoor space with panoramic city views for events and relaxation',
          duration: 70,
          position: { x: 0, y: 20, z: 0 },
          lookAt: { x: 10, y: 20, z: 10 },
          narration: 'The crown jewel of this property is the rooftop terrace, offering 360-degree city views. This space is perfect for corporate events, team building activities, or simply providing employees with an inspiring break area.',
          highlights: ['360-degree views', 'Event space', 'Team building area', 'Inspiring environment']
        }
      ]
    },
    {
      id: 'tour_2',
      name: 'Technical Systems Tour',
      description: 'Detailed overview of building infrastructure and technology systems',
      duration: 360, // 6 minutes
      narrator: 'Michael Rodriguez, Building Engineer',
      waypoints: [
        {
          id: 'wp_tech_1',
          name: 'HVAC Control Center',
          description: 'Advanced climate control systems with smart automation',
          duration: 90,
          position: { x: -20, y: -5, z: 0 },
          lookAt: { x: -15, y: -5, z: 0 },
          narration: 'Our state-of-the-art HVAC system features zone-based climate control, allowing different areas to maintain optimal temperatures independently. The smart automation reduces energy costs by up to 30%.',
          highlights: ['Zone-based control', 'Smart automation', '30% energy savings', 'Remote monitoring']
        },
        {
          id: 'wp_tech_2',
          name: 'IT Infrastructure Hub',
          description: 'Fiber optic connectivity and networking capabilities',
          duration: 85,
          position: { x: 10, y: -3, z: -10 },
          lookAt: { x: 15, y: -3, z: -10 },
          narration: 'The building is equipped with redundant fiber optic connections providing gigabit internet speeds. Our dedicated IT closets on each floor ensure reliable connectivity throughout the property.',
          highlights: ['Redundant fiber', 'Gigabit speeds', 'Floor IT closets', 'Reliable connectivity']
        },
        {
          id: 'wp_tech_3',
          name: 'Security Command Center',
          description: 'Comprehensive security systems and monitoring',
          duration: 95,
          position: { x: 5, y: 0, z: -15 },
          lookAt: { x: 10, y: 1, z: -15 },
          narration: 'Security is paramount with 24/7 monitoring, keycard access control, and HD surveillance cameras throughout the building. The system integrates with mobile apps for remote monitoring.',
          highlights: ['24/7 monitoring', 'Keycard access', 'HD cameras', 'Mobile integration']
        },
        {
          id: 'wp_tech_4',
          name: 'Backup Power Systems',
          description: 'Emergency power and uninterruptible power supply systems',
          duration: 90,
          position: { x: -15, y: -8, z: 5 },
          lookAt: { x: -10, y: -8, z: 5 },
          narration: 'Business continuity is ensured with backup generators and UPS systems that can maintain critical operations for up to 72 hours during power outages.',
          highlights: ['Backup generators', 'UPS systems', '72-hour capacity', 'Critical operations']
        }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying && selectedTour) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / selectedTour.duration);
          if (newProgress >= 100) {
            setIsPlaying(false);
            toast({
              title: "Tour Complete",
              description: `You've finished the ${selectedTour.name}`,
            });
            return 100;
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedTour, toast]);

  const startTour = (tour: VirtualTour) => {
    setSelectedTour(tour);
    setCurrentWaypoint(0);
    setProgress(0);
    setIsPlaying(true);
    toast({
      title: "Virtual Tour Started",
      description: `Beginning ${tour.name} for ${propertyName}`,
    });
  };

  const pauseTour = () => {
    setIsPlaying(!isPlaying);
  };

  const nextWaypoint = () => {
    if (selectedTour && currentWaypoint < selectedTour.waypoints.length - 1) {
      setCurrentWaypoint(currentWaypoint + 1);
    }
  };

  const previousWaypoint = () => {
    if (currentWaypoint > 0) {
      setCurrentWaypoint(currentWaypoint - 1);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-6">
      {/* Tour Selection */}
      {!selectedTour && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Virtual Property Tours for {propertyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <Card key={tour.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold mb-2">{tour.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {tour.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(tour.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {tour.waypoints.length} stops
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Guided
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Headphones className="mr-1 h-3 w-3" />
                        Narrated by {tour.narrator}
                      </Badge>
                    </div>
                    
                    <Button onClick={() => startTour(tour)} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Start Virtual Tour
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Tour Player */}
      {selectedTour && (
        <div className="space-y-4">
          {/* Tour Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  {selectedTour.name}
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedTour(null)}>
                  Exit Tour
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Main Tour View */}
          <Card>
            <CardContent className="p-0">
              {/* 3D View Area */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-96 relative rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 mx-auto mb-4 border-4 border-white/30 rounded-lg transform hover:rotate-3 transition-transform duration-700 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-6xl">🏢</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {selectedTour.waypoints[currentWaypoint]?.name}
                    </h3>
                    <p className="text-blue-100 max-w-md mx-auto">
                      {selectedTour.waypoints[currentWaypoint]?.description}
                    </p>
                  </div>
                </div>
                
                {/* VR Mode Button */}
                <div className="absolute top-4 right-4">
                  <Button className="bg-black/50 hover:bg-black/70 text-white border-white/30">
                    <Eye className="mr-2 h-4 w-4" />
                    Enter VR Mode
                  </Button>
                </div>
                
                {/* Current Waypoint Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/50 text-white border-white/30">
                    Stop {currentWaypoint + 1} of {selectedTour.waypoints.length}
                  </Badge>
                </div>
              </div>

              {/* Tour Controls */}
              <div className="p-6 bg-white dark:bg-gray-800 border-t">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={previousWaypoint}
                    disabled={currentWaypoint === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={pauseTour} size="lg" className="rounded-full">
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextWaypoint}
                    disabled={currentWaypoint === selectedTour.waypoints.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{volume[0]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Waypoint Details */}
          {selectedTour.waypoints[currentWaypoint] && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTour.waypoints[currentWaypoint].name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Narration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {selectedTour.waypoints[currentWaypoint].narration}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights</h4>
                    <ul className="text-sm space-y-1">
                      {selectedTour.waypoints[currentWaypoint].highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tour Waypoints List */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Waypoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedTour.waypoints.map((waypoint, index) => (
                  <div 
                    key={waypoint.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentWaypoint 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentWaypoint(index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{waypoint.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {waypoint.description}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(waypoint.duration)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VirtualPropertyTours;