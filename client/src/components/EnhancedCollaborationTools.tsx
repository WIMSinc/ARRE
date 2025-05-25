import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  PenTool, 
  Share2, 
  Download,
  Upload,
  Mic,
  Video,
  Monitor,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationUser {
  id: number;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

const EnhancedCollaborationTools = () => {
  const [activeUsers] = useState<CollaborationUser[]>([
    { id: 1, name: "Sarah Chen", role: "Architect", avatar: "SC", isOnline: true, cursor: { x: 150, y: 200 } },
    { id: 2, name: "Mike Johnson", role: "Client", avatar: "MJ", isOnline: true, cursor: { x: 300, y: 150 } },
    { id: 3, name: "Elena Rodriguez", role: "Designer", avatar: "ER", isOnline: true, cursor: { x: 200, y: 250 } },
  ]);

  const [chatMessages] = useState([
    { id: 1, user: "Sarah Chen", message: "The lighting in the main conference room looks excellent", time: "2 min ago" },
    { id: 2, user: "Mike Johnson", message: "Can we adjust the wall color to something warmer?", time: "1 min ago" },
    { id: 3, user: "Elena Rodriguez", message: "I'll add that to the design notes", time: "30 sec ago" },
  ]);

  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startWhiteboard = () => {
    setIsWhiteboardActive(true);
    toast({
      title: "Virtual Whiteboard Active",
      description: "Start drawing and annotating in 3D space!",
    });
  };

  const shareScreen = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: isScreenSharing ? "Sharing has ended" : "Your view is now visible to all participants",
    });
  };

  const shareDocument = () => {
    toast({
      title: "Document Shared",
      description: "Property blueprints are now accessible to all collaborators",
    });
  };

  const startVoiceNote = () => {
    toast({
      title: "Voice Note Recording",
      description: "Recording spatial audio annotation...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Collaborators ({activeUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/avatars/${user.avatar}.jpg`} />
                    <AvatarFallback className="bg-primary text-white">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Live
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Real-time Discussion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
            {chatMessages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {message.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea 
              placeholder="Type your message or voice note..."
              className="flex-1 min-h-[40px] max-h-[100px]"
            />
            <Button size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={startVoiceNote}>
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Whiteboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            3D Virtual Whiteboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Whiteboard Canvas */}
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <canvas 
                ref={canvasRef}
                width={600}
                height={300}
                className="w-full h-60 bg-white rounded-lg cursor-crosshair"
                style={{ background: isWhiteboardActive ? 'white' : '#f9fafb' }}
              />
              
              {/* User Cursors */}
              {isWhiteboardActive && activeUsers.map((user) => user.cursor && (
                <div 
                  key={`cursor-${user.id}`}
                  className="absolute pointer-events-none"
                  style={{ 
                    left: user.cursor.x, 
                    top: user.cursor.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="bg-primary text-white px-2 py-1 rounded text-xs">
                    {user.name}
                  </div>
                </div>
              ))}
              
              {!isWhiteboardActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={startWhiteboard} className="bg-primary">
                    <PenTool className="mr-2 h-4 w-4" />
                    Start Collaborative Drawing
                  </Button>
                </div>
              )}
            </div>

            {/* Drawing Tools */}
            {isWhiteboardActive && (
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('pen')}
                  >
                    <PenTool className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('eraser')}
                  >
                    ✏️
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedTool === 'shapes' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('shapes')}
                  >
                    📐
                  </Button>
                  <Button size="sm" variant="outline">
                    <Palette className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Shared Documents</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Property Blueprints.pdf</span>
                  </div>
                  <Badge className="bg-green-500 text-white">Live</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Floor Plans.dwg</span>
                  </div>
                  <Badge variant="outline">Shared</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">3D Models.obj</span>
                  </div>
                  <Badge variant="outline">Shared</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Actions</h4>
              <div className="flex flex-col gap-2">
                <Button onClick={shareDocument} className="justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
                <Button variant="outline" className="justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with External Client
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Files
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen Sharing & Meeting Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Meeting Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={shareScreen}
              variant={isScreenSharing ? "destructive" : "default"}
            >
              <Monitor className="mr-2 h-4 w-4" />
              {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
            <Button variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Start Video Call
            </Button>
            <Button variant="outline">
              <Mic className="mr-2 h-4 w-4" />
              Spatial Audio On
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Invite More Users
            </Button>
          </div>
          
          {isScreenSharing && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Screen sharing active</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">- All participants can see your view</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collaboration Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Collaboration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Multi-User VR</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Up to 20 users</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Real-time Chat</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Text & Voice</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <PenTool className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">3D Whiteboard</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Spatial Drawing</p>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Document Sync</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Live Editing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCollaborationTools;