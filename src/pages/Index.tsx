import React, { useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import EngagementIndicator from "@/components/EngagementIndicator";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

const Index = () => {
  const [engagement, setEngagement] = useState(100);
  const { toast } = useToast();

  // Simulate backend responses
  const handleFrame = (frame: string) => {
    // Simulate face recognition response
    setTimeout(() => {
      const recognized = Math.random() > 0.1;
      if (!recognized) {
        toast({
          title: "Face Not Detected",
          description: "Please ensure your face is visible in the camera",
          variant: "destructive",
        });
      }
    }, 500);

    // Simulate engagement analysis
    const newEngagement = Math.max(60, Math.min(100, engagement + (Math.random() - 0.5) * 10));
    setEngagement(Math.round(newEngagement));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center bg-primary/10 px-3 py-1 rounded-full mb-4">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Virtual Classroom</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Class
          </h1>
          <p className="text-gray-600">
            Your virtual attendance system is ready
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <CameraFeed onFrame={handleFrame} />
          </div>
          
          <div className="space-y-6">
            <Card className="p-4 bg-white shadow-lg animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-700">Class Status</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p className="flex justify-between py-2 border-b">
                  <span>Duration</span>
                  <span className="font-medium">00:45:30</span>
                </p>
                <p className="flex justify-between py-2">
                  <span>Attendance Status</span>
                  <span className="text-green-500 font-medium">Present</span>
                </p>
              </div>
            </Card>
            
            <EngagementIndicator engagement={engagement} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;