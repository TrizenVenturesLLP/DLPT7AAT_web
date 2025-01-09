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
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      if (videoRef.current && canvasRef.current && isActive) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");
        
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0);
          const frame = canvas.toDataURL("image/jpeg");
          onFrame(frame);
          
          try {
            const result = await processFrame(frame);
            if (result.faces) {
              onFaceDetection(result.faces);
            }
          } catch (error) {
            console.error("Error processing frame:", error);
          }
        }
      }
    };

    const interval = setInterval(captureFrame, 1000);
    return () => clearInterval(interval);
  }, [isActive, onFrame, onFaceDetection]);

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto bg-white shadow-lg animate-fadeIn">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg aspect-video bg-gray-100"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isActive ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Live</span>
            </div>
          ) : (
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Inactive</span>
            </div>
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