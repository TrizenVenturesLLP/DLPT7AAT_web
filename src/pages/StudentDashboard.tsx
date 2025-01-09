import React from "react";
import CameraFeed from "@/components/CameraFeed";
import EngagementIndicator from "@/components/EngagementIndicator";

const StudentDashboard = () => {
  const handleFrame = (frame: string) => {
    console.log("Frame captured");
  };

  const handleFaceDetection = (faces: string[]) => {
    console.log("Faces detected:", faces);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <CameraFeed onFrame={handleFrame} onFaceDetection={handleFaceDetection} />
          <EngagementIndicator engagement={100} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;