import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Focus } from "lucide-react";

interface EngagementIndicatorProps {
  engagement: number;
}

const EngagementIndicator: React.FC<EngagementIndicatorProps> = ({ engagement }) => {
  const getEngagementColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-4 bg-white shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-700">Engagement Level</h3>
        </div>
        <Focus className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getEngagementColor(engagement)} transition-all duration-500 ease-out`}
          style={{ width: `${engagement}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-600 flex justify-between">
        <span>Current Level</span>
        <span className="font-medium">{engagement}%</span>
      </div>
    </Card>
  );
};

export default EngagementIndicator;