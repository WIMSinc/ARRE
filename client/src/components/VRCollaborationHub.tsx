import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Video, MessageSquare, Hand, Mic, MicOff, VideoOff, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VRCollaborationHubProps {
  propertyId: number;
  propertyName: string;
}

const VRCollaborationHub = ({ propertyId, propertyName }: VRCollaborationHubProps) => {
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([
    { id: 1, name: "Sarah Chen", role: "Architect", avatar: "SC", status: "speaking" },
    { id: 2, name: "Mike Johnson", role: "Client", avatar: "MJ", status: "listening" },
    { id: 3, name: "Elena Rodriguez", role: "Designer", avatar: "ER", status: "drawing" },
  ]);
  const { toast } = useToast();

  const startVRMeeting = () => {
    setIsInMeeting(true);
    toast({
      title: "VR Meeting Started",
      description: `Multi-user VR session for ${propertyName} is now live!`,
    });
  };

  const shareScreen = () => {
    toast({
      title: "Screen Shared",
      description: "Your 3D model view is now visible to all participants",
    });
  };

  const inviteParticipants = () => {
    toast({
      title: "Invitations Sent",
      description: "VR meeting invites sent to project stakeholders",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          VR Collaboration Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Users */}
          <div>
            <h4 className="font-medium mb-3">Connected Users ({connectedUsers.length})</h4>
            <div className="flex flex-wrap gap-3">
              {connectedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/${user.avatar}.jpg`} />
                    <AvatarFallback className="bg-primary text-white">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Controls */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Meeting Controls</h4>
              <Badge className={isInMeeting ? "bg-green-500" : "bg-gray-500"}>
                {isInMeeting ? "Live Meeting" : "Ready to Start"}
              </Badge>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {!isInMeeting ? (
                <Button onClick={startVRMeeting} className="bg-primary">
                  <Video className="mr-2 h-4 w-4" />
                  Start VR Meeting
                </Button>
              ) : (
                <>
                  <Button
                    variant={isMicOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareScreen}>
                    <Share className="mr-2 h-4 w-4" />
                    Share View
                  </Button>
                </>
              )}
              
              <Button variant="outline" onClick={inviteParticipants}>
                <Users className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          </div>

          {/* VR Features */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">VR Collaboration Features</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Hand className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Spatial Annotations</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Point and mark areas in 3D space with voice notes
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Real-time Chat</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Text and voice messages in virtual space
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Avatar Presence</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  See teammates' positions and gestures
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Share className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Shared Whiteboard</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Draw and sketch ideas in 3D space together
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRCollaborationHub;