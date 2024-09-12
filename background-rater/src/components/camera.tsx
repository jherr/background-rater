"use client";
import { useState, useRef, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function Camera({
  onUploadImage,
}: {
  onUploadImage: (formData: FormData) => void;
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function getDevices() {
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    }
    getDevices();
  }, []);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice, width: 1920 / 2 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setImageCapture(new ImageCapture(stream.getVideoTracks()[0]));
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  };

  const takePhoto = async () => {
    if (videoRef.current && imageCapture) {
      setUploading(true);
      videoRef.current.pause();
      const blob = await imageCapture.takePhoto();
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      await onUploadImage(formData);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Take A Picture Of Your Workspace
      </h2>

      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover`}
        />
      </div>

      {uploading && <div>Uploading...</div>}
      {!uploading && (
        <div className="flex space-x-4">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={startCapture} disabled={isCapturing}>
            Start Capture
          </Button>

          <Button onClick={takePhoto} disabled={!isCapturing}>
            Take Photo
          </Button>
        </div>
      )}
    </div>
  );
}
