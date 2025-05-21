import { TrendingUp, DollarSign, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const ValueProposition = () => {
  return (
    <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg shadow-lg p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="font-bold text-xl mb-4">AR/VR Benefits</h3>
        <p className="mb-6 text-white/90">Our mixed reality solutions help you close deals faster and reduce project costs.</p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="rounded-full bg-white/20 p-2 mr-3 flex-shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">32% faster deal closure</h4>
              <p className="text-sm text-white/80">Immersive visualizations accelerate client decision-making</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="rounded-full bg-white/20 p-2 mr-3 flex-shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">24% cost reduction</h4>
              <p className="text-sm text-white/80">Catch design issues early before construction begins</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="rounded-full bg-white/20 p-2 mr-3 flex-shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">95% client satisfaction</h4>
              <p className="text-sm text-white/80">Enhanced visualization leads to happier clients</p>
            </div>
          </div>
        </div>
      </div>
      
      <Button className="w-full py-3 bg-white text-primary font-medium rounded-md hover:bg-white/90 transition-colors">
        Learn More About AR Benefits
      </Button>
    </div>
  );
};

export default ValueProposition;
