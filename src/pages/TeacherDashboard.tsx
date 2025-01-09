import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TeacherDashboard = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const { toast } = useToast();

  const downloadAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/download-attendance');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Attendance report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download attendance report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Student Attendance</h2>
            </div>
            <Button onClick={downloadAttendance}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
          
          <div className="space-y-4">
            {attendanceData.map((student, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-600">Status: {student.status}</p>
                <p className="text-sm text-gray-600">Engagement: {student.engagement}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;