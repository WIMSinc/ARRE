import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  BarChart3,
  TrendingUp,
  User,
  Calendar,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackEntry {
  id: string;
  clientName: string;
  clientEmail: string;
  propertyId: number;
  propertyName: string;
  overallRating: number;
  vrExperienceRating: number;
  propertyFeaturesRating: number;
  tourQualityRating: number;
  comments: string;
  wouldRecommend: boolean;
  interestedInViewing: boolean;
  submittedAt: Date;
  source: 'vr_tour' | 'mobile_ar' | 'website' | 'in_person';
}

interface ClientFeedbackSystemProps {
  propertyId?: number;
  propertyName?: string;
  mode: 'collect' | 'analyze';
}

const ClientFeedbackSystem = ({ propertyId, propertyName, mode }: ClientFeedbackSystemProps) => {
  const [feedback, setFeedback] = useState({
    clientName: '',
    clientEmail: '',
    overallRating: 0,
    vrExperienceRating: 0,
    propertyFeaturesRating: 0,
    tourQualityRating: 0,
    comments: '',
    wouldRecommend: false,
    interestedInViewing: false
  });

  const [feedbackEntries] = useState<FeedbackEntry[]>([
    {
      id: 'fb_001',
      clientName: 'Jennifer Walsh',
      clientEmail: 'jennifer.walsh@techcorp.com',
      propertyId: 4,
      propertyName: 'Metropolitan Plaza',
      overallRating: 5,
      vrExperienceRating: 5,
      propertyFeaturesRating: 4,
      tourQualityRating: 5,
      comments: 'The VR tour was absolutely incredible! I felt like I was actually walking through the space. The conference rooms and open areas would be perfect for our growing team.',
      wouldRecommend: true,
      interestedInViewing: true,
      submittedAt: new Date('2024-01-25T10:30:00'),
      source: 'vr_tour'
    },
    {
      id: 'fb_002',
      clientName: 'Marcus Chen',
      clientEmail: 'marcus.chen@startupventures.com',
      propertyId: 4,
      propertyName: 'Metropolitan Plaza',
      overallRating: 4,
      vrExperienceRating: 4,
      propertyFeaturesRating: 5,
      tourQualityRating: 4,
      comments: 'Great property with excellent amenities. The mobile AR feature helped me visualize our office layout perfectly. Would love to schedule an in-person visit.',
      wouldRecommend: true,
      interestedInViewing: true,
      submittedAt: new Date('2024-01-24T14:15:00'),
      source: 'mobile_ar'
    },
    {
      id: 'fb_003',
      clientName: 'Sarah Rodriguez',
      clientEmail: 'sarah.rodriguez@consulting.com',
      propertyId: 1,
      propertyName: 'Riverfront Tower',
      overallRating: 3,
      vrExperienceRating: 4,
      propertyFeaturesRating: 3,
      tourQualityRating: 3,
      comments: 'The technology is impressive, but the space feels a bit cramped for our needs. The riverside location is definitely a plus though.',
      wouldRecommend: false,
      interestedInViewing: false,
      submittedAt: new Date('2024-01-23T16:45:00'),
      source: 'website'
    }
  ]);

  const { toast } = useToast();

  const handleRatingChange = (category: string, rating: number) => {
    setFeedback(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = () => {
    if (!feedback.clientName || !feedback.clientEmail || feedback.overallRating === 0) {
      toast({
        title: "Please complete all required fields",
        description: "Name, email, and overall rating are required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback. We'll be in touch soon!",
    });

    // Reset form
    setFeedback({
      clientName: '',
      clientEmail: '',
      overallRating: 0,
      vrExperienceRating: 0,
      propertyFeaturesRating: 0,
      tourQualityRating: 0,
      comments: '',
      wouldRecommend: false,
      interestedInViewing: false
    });
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

  const calculateAverageRating = (entries: FeedbackEntry[], category: keyof FeedbackEntry) => {
    const ratings = entries.map(entry => entry[category] as number).filter(rating => rating > 0);
    return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
  };

  const getRecommendationRate = () => {
    const recommendations = feedbackEntries.filter(entry => entry.wouldRecommend).length;
    return feedbackEntries.length > 0 ? (recommendations / feedbackEntries.length) * 100 : 0;
  };

  const getInterestRate = () => {
    const interested = feedbackEntries.filter(entry => entry.interestedInViewing).length;
    return feedbackEntries.length > 0 ? (interested / feedbackEntries.length) * 100 : 0;
  };

  if (mode === 'collect') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Share Your Feedback
            {propertyName && <span className="text-gray-500">- {propertyName}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Your Name *</Label>
              <Input
                id="clientName"
                value={feedback.clientName}
                onChange={(e) => setFeedback(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email Address *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={feedback.clientEmail}
                onChange={(e) => setFeedback(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Rating Sections */}
          <div className="space-y-4">
            <StarRating
              rating={feedback.overallRating}
              onRatingChange={(rating) => handleRatingChange('overallRating', rating)}
              label="Overall Experience *"
            />
            
            <StarRating
              rating={feedback.vrExperienceRating}
              onRatingChange={(rating) => handleRatingChange('vrExperienceRating', rating)}
              label="VR/AR Technology Experience"
            />
            
            <StarRating
              rating={feedback.propertyFeaturesRating}
              onRatingChange={(rating) => handleRatingChange('propertyFeaturesRating', rating)}
              label="Property Features & Amenities"
            />
            
            <StarRating
              rating={feedback.tourQualityRating}
              onRatingChange={(rating) => handleRatingChange('tourQualityRating', rating)}
              label="Virtual Tour Quality"
            />
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              value={feedback.comments}
              onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Share your thoughts about the property, tour experience, or any suggestions..."
              rows={4}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant={feedback.wouldRecommend ? "default" : "outline"}
                size="sm"
                onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: !prev.wouldRecommend }))}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                I would recommend this property
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={feedback.interestedInViewing ? "default" : "outline"}
                size="sm"
                onClick={() => setFeedback(prev => ({ ...prev, interestedInViewing: !prev.interestedInViewing }))}
              >
                <Calendar className="mr-2 h-4 w-4" />
                I'm interested in scheduling a visit
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full" size="lg">
            <Send className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Analytics Mode
  return (
    <div className="space-y-6">
      {/* Feedback Analytics Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Client Feedback Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {calculateAverageRating(feedbackEntries, 'overallRating').toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= calculateAverageRating(feedbackEntries, 'overallRating') 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(getRecommendationRate())}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recommendation Rate</div>
              <div className="mt-1">
                <Progress value={getRecommendationRate()} className="h-2" />
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(getInterestRate())}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Interest in Viewing</div>
              <div className="mt-1">
                <Progress value={getInterestRate()} className="h-2" />
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {feedbackEntries.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Responses</div>
              <div className="flex justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Rating Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'vrExperienceRating', label: 'VR/AR Experience' },
              { key: 'propertyFeaturesRating', label: 'Property Features' },
              { key: 'tourQualityRating', label: 'Tour Quality' }
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-gray-500">
                    {calculateAverageRating(feedbackEntries, key as keyof FeedbackEntry).toFixed(1)}/5.0
                  </span>
                </div>
                <Progress 
                  value={(calculateAverageRating(feedbackEntries, key as keyof FeedbackEntry) / 5) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Client Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {entry.clientName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.propertyName} • {entry.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= entry.overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {entry.source.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{entry.comments}</p>
                
                <div className="flex gap-2">
                  {entry.wouldRecommend && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Recommends
                    </Badge>
                  )}
                  {entry.interestedInViewing && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Calendar className="mr-1 h-3 w-3" />
                      Wants to Visit
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFeedbackSystem;