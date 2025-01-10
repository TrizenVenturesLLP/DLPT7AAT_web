import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface AttendanceRecord {
  date: string;
  name: string;
  status: string;
  engagement: number;
  remarks: string;
}

const TeacherDashboard = () => {
  const { toast } = useToast();

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/get-attendance');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      return response.json() as Promise<AttendanceRecord[]>;
    }
  });

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

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return "bg-green-100 border-green-500 text-green-700";
    if (engagement >= 60) return "bg-yellow-100 border-yellow-500 text-yellow-700";
    return "bg-red-100 border-red-500 text-red-700";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading attendance data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <Button onClick={downloadAttendance} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
        </div>
        
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Student Attendance & Engagement</h2>
          </div>
          
          <div className="space-y-4">
            {attendanceData?.map((record, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg ${getEngagementColor(record.engagement)} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{record.name}</h3>
                    <p className="text-sm opacity-75">Date: {record.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Engagement Score</p>
                      <p className="text-2xl font-bold">{record.engagement}%</p>
                    </div>
                    {record.engagement < 70 ? (
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium">
                  Remarks: {record.remarks}
                </p>
              </div>
            ))}

            {(!attendanceData || attendanceData.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;