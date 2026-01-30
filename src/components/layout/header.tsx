"use client";

import { Phone, MessageSquare, ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onChatClick?: () => void;
  onCallClick?: () => void;
}

export function Header({
  onChatClick,
  onCallClick,
}: HeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Phone Numbers */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">2 numbers</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Sandbox
            </p>
            <p className="text-sm">+1 (555) 123-4567</p>
          </div>
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Live
            </p>
            <p className="text-sm">+1 (555) 987-6543</p>
          </div>
          <DropdownMenuItem className="mt-2">
            Manage numbers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Call Agent */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onCallClick}
          >
            <Phone className="h-4 w-4" />
            <span className="sr-only">Call agent</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Call agent</TooltipContent>
      </Tooltip>

      {/* Chat with Agent */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onChatClick}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Chat with agent</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Chat with agent</TooltipContent>
      </Tooltip>
    </div>
  );
}

// Draft Header (shown when there are draft changes)
export function DraftHeader({
  isSaving = false,
  isSaved = false,
  onDeleteDraft,
  onPublish,
}: {
  isSaving?: boolean;
  isSaved?: boolean;
  onDeleteDraft?: () => void;
  onPublish?: () => void;
}) {
  return (
    <div className="flex h-10 items-center justify-between border-b bg-muted/50 px-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline">Draft</Badge>
        {isSaving && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            Saving...
          </span>
        )}
        {isSaved && !isSaving && (
          <span className="flex items-center gap-2 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Saved
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDeleteDraft}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete draft</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete draft</TooltipContent>
        </Tooltip>
        <Button size="sm" onClick={onPublish}>
          Publish
        </Button>
      </div>
    </div>
  );
}

// Preview Header (shown when in preview mode)
export function PreviewHeader({
  environment = "Sandbox",
  version = "v1.2.3",
  onExitPreview,
}: {
  environment?: string;
  version?: string;
  onExitPreview?: () => void;
}) {
  return (
    <div className="flex h-10 items-center justify-between border-b bg-blue-50 dark:bg-blue-950 px-4">
      <div className="flex items-center gap-3">
        <Badge variant="secondary">{environment}</Badge>
        <span className="text-sm text-muted-foreground">{version}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onExitPreview}>
        Exit preview
      </Button>
    </div>
  );
}
