import React, { useState, useEffect } from "react";
import CameraFeed from "@/components/CameraFeed";
import EngagementIndicator from "@/components/EngagementIndicator";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

const StudentDashboard = () => {
  const [currentEngagement, setCurrentEngagement] = useState(100);
  const [engagementRemarks, setEngagementRemarks] = useState("");
  const { toast } = useToast();

  const handleFrame = (frame: string) => {
    console.log("Frame captured");
  };

  const handleFaceDetection = (faces: string[]) => {
    console.log("Faces detected:", faces);
    if (faces.length > 0) {
      toast({
        title: "Attendance Marked",
        description: `Welcome ${faces[0]}! Your attendance has been recorded.`,
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (currentEngagement < 70) {
      toast({
        title: "Low Engagement Alert",
        description: engagementRemarks || "Please stay focused on the class",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [currentEngagement, engagementRemarks, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Virtual Classroom</h1>
        
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <CameraFeed 
              onFrame={handleFrame} 
              onFaceDetection={handleFaceDetection}
              onEngagementUpdate={(score, remarks) => {
                setCurrentEngagement(score);
                setEngagementRemarks(remarks);
              }}
            />
            
            {currentEngagement < 70 && (
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">{engagementRemarks}</p>
                </div>
              </Card>
            )}
          </div>
          
          <div className="space-y-4">
            <EngagementIndicator engagement={currentEngagement} remarks={engagementRemarks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;