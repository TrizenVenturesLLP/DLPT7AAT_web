import React, { useRef, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, CheckCircle } from "lucide-react";
import { processFrame } from "@/services/api";

interface CameraFeedProps {
  onFrame: (frame: string) => void;
  onFaceDetection: (faces: string[]) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onFrame, onFaceDetection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const { toast } = useToast();
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentName, setCurrentName] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
          toast({
            title: "Camera activated",
            description: "Your camera feed is now active",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, toast]);

  useEffect(() => {
    const captureFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isActive) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear previous drawings
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0);

      const frame = canvas.toDataURL("image/jpeg");
      onFrame(frame);

      try {
        const result = await processFrame(frame);
        if (result.faces && result.faces.length > 0) {
          setFaceDetected(true);
          
          // Only draw frame and label if attendance hasn't been marked
          if (!attendanceMarked) {
            // Draw rectangle for each detected face
            const faceWidth = canvas.width * 0.5;
            const faceHeight = canvas.height * 0.5;
            const x = (canvas.width - faceWidth) / 2;
            const y = (canvas.height - faceHeight) / 2;

            const isKnownFace = result.faces[0] !== "Unknown";
            context.strokeStyle = isKnownFace ? "#22c55e" : "#ef4444";
            context.lineWidth = 3;
            context.strokeRect(x, y, faceWidth, faceHeight);

            // Draw name label above the frame
            const name = result.faces[0];
            setCurrentName(name);
            context.fillStyle = isKnownFace ? "#22c55e" : "#ef4444";
            context.font = "24px Arial";
            context.textAlign = "center";
            context.fillText(name, x + faceWidth / 2, y - 10);

            // Mark attendance if face is recognized and not already marked
            if (isKnownFace && !attendanceMarked) {
              onFaceDetection(result.faces);
              setAttendanceMarked(true);
              toast({
                title: "Attendance Marked",
                description: `Welcome ${name}! Your attendance has been recorded.`,
                duration: 5000,
              });
            }
          }
        } else {
          setFaceDetected(false);
          setCurrentName("");
        }
      } catch (error) {
        console.error("Error processing frame:", error);
      }
    };

    const interval = setInterval(captureFrame, 1000);
    return () => clearInterval(interval);
  }, [isActive, onFrame, onFaceDetection, attendanceMarked, toast]);

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto bg-white shadow-lg animate-fadeIn">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg aspect-video bg-gray-100"
        />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="hidden"
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isActive && (
            <>
              <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                attendanceMarked 
                  ? "bg-green-500 text-white"
                  : faceDetected 
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-500 text-white"
              }`}>
                {attendanceMarked ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Marked: {currentName}</span>
                  </>
                ) : faceDetected ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Face Detected</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Scanning</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => setIsActive(!isActive)}
          className={`${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          } text-white transition-colors duration-200`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isActive ? "Stop Camera" : "Start Camera"}
        </Button>
      </div>
    </Card>
  );
};

export default CameraFeed;