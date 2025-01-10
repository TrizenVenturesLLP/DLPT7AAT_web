import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Focus, AlertTriangle, CheckCircle } from "lucide-react";

interface EngagementIndicatorProps {
  engagement: number;
  remarks?: string;
}

const EngagementIndicator: React.FC<EngagementIndicatorProps> = ({ engagement, remarks }) => {
  const getEngagementColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEngagementIcon = (level: number) => {
    if (level >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (level >= 60) return <Focus className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getEngagementText = (level: number) => {
    if (level >= 80) return "Excellent Engagement";
    if (level >= 60) return "Moderate Engagement";
    return "Low Engagement";
  };

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg animate-fadeIn border-t-4 transition-colors duration-300" 
          style={{ borderTopColor: engagement >= 80 ? '#22c55e' : engagement >= 60 ? '#eab308' : '#ef4444' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-700">Engagement Level</h3>
        </div>
        {getEngagementIcon(engagement)}
      </div>
      
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getEngagementColor(engagement)} transition-all duration-500 ease-out`}
          style={{ width: `${engagement}%` }}
        />
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{getEngagementText(engagement)}</span>
        <span className="text-sm font-bold text-gray-700">{engagement}%</span>
      </div>

      {remarks && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100 animate-fadeIn">
          <p className="text-sm text-gray-600">{remarks}</p>
        </div>
      )}
    </Card>
  );
};

export default EngagementIndicator;