"use client";

import { useState } from "react";
import {
  Phone,
  PhoneOff,
  MessageSquare,
  Mic,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CallPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENVIRONMENTS = [
  { value: "draft", label: "Draft" },
  { value: "sandbox", label: "Sandbox" },
  { value: "pre-release", label: "Pre-Release" },
  { value: "live", label: "Live" },
];

const MICROPHONES = [
  { value: "default", label: "Default Microphone" },
  { value: "builtin", label: "Built-in Microphone" },
  { value: "external", label: "External Microphone" },
];

// Simple audio visualizer bars
function AudioVisualizer({ isActive }: { isActive: boolean }) {
  const bars = 20;

  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-muted-foreground/40 rounded-full transition-all duration-150",
            isActive && "animate-pulse"
          )}
          style={{
            height: isActive
              ? `${Math.random() * 32 + 8}px`
              : "8px",
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function CallPanel({ isOpen, onClose }: CallPanelProps) {
  const [environment, setEnvironment] = useState("sandbox");
  const [variant, setVariant] = useState("default");
  const [microphone, setMicrophone] = useState("default");
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleStartCall = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsInCall(true);
      // Start call duration timer
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      // Store interval ID for cleanup
      (window as unknown as { callInterval: NodeJS.Timeout }).callInterval = interval;
    }, 2000);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    // Clear interval
    clearInterval((window as unknown as { callInterval: NodeJS.Timeout }).callInterval);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[400px] sm:max-w-[400px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">
              Test agent call
            </SheetTitle>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View conversation</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SheetHeader>

        {/* Configuration Section */}
        <div className="px-4 py-4 space-y-4 border-b flex-shrink-0">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Environment</Label>
            <Select
              value={environment}
              onValueChange={setEnvironment}
              disabled={isInCall || isConnecting}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENVIRONMENTS.map((env) => (
                  <SelectItem key={env.value} value={env.value}>
                    {env.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Variant</Label>
            <Select
              value={variant}
              onValueChange={setVariant}
              disabled={isInCall || isConnecting}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="variant-a">Variant A</SelectItem>
                <SelectItem value="variant-b">Variant B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Microphone</Label>
            <Select
              value={microphone}
              onValueChange={setMicrophone}
              disabled={isInCall || isConnecting}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MICROPHONES.map((mic) => (
                  <SelectItem key={mic.value} value={mic.value}>
                    <div className="flex items-center gap-2">
                      <Mic className="h-3 w-3" />
                      {mic.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Audio Visualizer Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Audio Icon */}
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                isInCall ? "bg-primary/10" : "bg-muted"
              )}
            >
              <Volume2
                className={cn(
                  "h-8 w-8 transition-colors",
                  isInCall ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>

            {/* Visualizer */}
            <div className="w-full max-w-[280px]">
              <AudioVisualizer isActive={isInCall} />
            </div>

            {/* Call Status */}
            {isInCall && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Call in progress</p>
                <p className="text-2xl font-mono font-medium mt-1">
                  {formatDuration(callDuration)}
                </p>
              </div>
            )}

            {isConnecting && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Connecting...</p>
              </div>
            )}

            {!isInCall && !isConnecting && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Ready to start a test call
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call Control Section */}
        <div className="p-4 border-t flex-shrink-0">
          {!isInCall ? (
            <Button
              className="w-full"
              size="lg"
              onClick={handleStartCall}
              disabled={isConnecting}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isConnecting ? "Calling..." : "Start test call"}
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              variant="destructive"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End call
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
