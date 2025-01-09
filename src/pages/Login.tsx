import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (role: 'student' | 'teacher') => {
    // In a real app, this would involve actual authentication
    localStorage.setItem('userRole', role);
    toast({
      title: "Login Successful",
      description: `Logged in as ${role}`,
    });
    navigate(role === 'student' ? '/student' : '/teacher');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Virtual Classroom Login
        </h1>
        <div className="space-y-4">
          <Button 
            onClick={() => handleLogin('student')} 
            className="w-full bg-primary"
          >
            Login as Student
          </Button>
          <Button 
            onClick={() => handleLogin('teacher')} 
            variant="outline" 
            className="w-full"
          >
            Login as Teacher
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;