"use client";

import { useState, useCallback } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "./app-sidebar";
import { Header, DraftHeader } from "./header";
import { ChatPanel, CallPanel } from "@/components/panels";

interface AppLayoutProps {
  children: React.ReactNode;
  projectName?: string;
  language?: string;
  showDraftHeader?: boolean;
  isSaving?: boolean;
  isSaved?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AppLayout({
  children,
  projectName = "My Agent",
  language = "English (US)",
  showDraftHeader = false,
  isSaving = false,
  isSaved = false,
  breadcrumbs,
}: AppLayoutProps) {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);

  const handleOpenChat = useCallback(() => {
    setIsCallPanelOpen(false);
    setIsChatPanelOpen(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatPanelOpen(false);
  }, []);

  const handleOpenCall = useCallback(() => {
    setIsChatPanelOpen(false);
    setIsCallPanelOpen(true);
  }, []);

  const handleCloseCall = useCallback(() => {
    setIsCallPanelOpen(false);
  }, []);

  return (
    <TooltipProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "48px",
        } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            {/* Project Info */}
            <div className="flex items-center gap-3 flex-1">
              <span className="font-semibold text-foreground">{projectName}</span>
              <span className="text-sm text-muted-foreground">{language}</span>
            </div>

            {/* Header Actions */}
            <Header
              onChatClick={handleOpenChat}
              onCallClick={handleOpenCall}
            />
          </header>

          {showDraftHeader && (
            <DraftHeader isSaving={isSaving} isSaved={isSaved} />
          )}

          <main className="flex-1">{children}</main>
        </SidebarInset>

        {/* Side Panels */}
        <ChatPanel isOpen={isChatPanelOpen} onClose={handleCloseChat} />
        <CallPanel isOpen={isCallPanelOpen} onClose={handleCloseCall} />
      </SidebarProvider>
    </TooltipProvider>
  );
}
