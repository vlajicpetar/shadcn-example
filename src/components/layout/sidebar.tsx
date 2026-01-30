"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  Phone,
  History,
  HelpCircle,
  Headphones,
  ChevronLeft,
  ChevronDown,
  X,
  Workflow,
  FunctionSquare,
  Plug,
  GitBranch,
  PhoneForwarded,
  MessageCircle,
  Mic,
  FlaskConical,
  Globe,
  Volume2,
  AudioLines,
  SlidersHorizontal,
  Server,
  BookOpen,
  Shield,
  PieChart,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Manage",
    defaultOpen: true,
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Smart analyst", href: "/smart-analyst", icon: Brain },
      { label: "Conversations", href: "/conversations", icon: MessageSquare },
      { label: "Agent analysis", href: "/agent-analysis", icon: PieChart },
      { label: "Real time config", href: "/real-time-config", icon: SlidersHorizontal },
      { label: "Enterprise safety", href: "/enterprise-safety", icon: Shield },
    ],
  },
  {
    title: "Analyze",
    defaultOpen: true,
    items: [
      { label: "Overview", href: "/analytics", icon: LayoutDashboard },
    ],
  },
  {
    title: "Build",
    defaultOpen: true,
    items: [
      { label: "Agent", href: "/agent", icon: BarChart3 },
      { label: "Source Hub", href: "/source-hub", icon: BookOpen, badge: "Beta" },
      { label: "Knowledge base", href: "/knowledge-base", icon: Brain },
      { label: "Flows", href: "/flows", icon: Workflow },
      { label: "Functions", href: "/functions", icon: FunctionSquare },
      { label: "APIs", href: "/apis", icon: Plug },
      { label: "Variant management", href: "/variant-management", icon: GitBranch },
      { label: "Call handoffs", href: "/call-handoffs", icon: PhoneForwarded },
      { label: "SMS", href: "/sms", icon: MessageCircle },
      { label: "Model training", href: "/model-training", icon: FlaskConical },
      { label: "Speech recognition", href: "/speech-recognition", icon: Mic },
      { label: "Test suite", href: "/test-suite", icon: FlaskConical },
      { label: "Language hub", href: "/language-hub", icon: Globe, badge: "Beta" },
    ],
  },
  {
    title: "Voice",
    defaultOpen: true,
    items: [
      { label: "Agent voice", href: "/agent-voice", icon: Volume2 },
      { label: "Audio management", href: "/audio-management", icon: AudioLines },
      { label: "Response control", href: "/response-control", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Configure",
    defaultOpen: true,
    items: [
      { label: "Environments", href: "/environments", icon: Server },
      { label: "Numbers", href: "/numbers", icon: Phone },
      { label: "Project history", href: "/project-history", icon: History },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function NavSectionItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-white/10 text-white font-medium"
              : "text-white/70 hover:bg-white/10 hover:text-white",
            item.disabled && "pointer-events-none opacity-50"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-white/10 text-white/70 hover:bg-white/20">
              {item.badge}
            </Badge>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="hidden lg:block">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function CollapsibleNavSection({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? true);
  const hasActiveItem = section.items.some((item) => pathname === item.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
            "text-white/50 hover:text-white/70 hover:bg-white/5"
          )}
        >
          <span>{section.title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 transition-all duration-200">
        <nav className="space-y-1 pt-1">
          {section.items.map((item) => (
            <NavSectionItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Sidebar({ isOpen, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-white/10 text-white" style={{ backgroundColor: "rgb(22, 22, 23)" }}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white font-semibold text-sm">
            PA
          </div>
          <span className="font-semibold truncate text-white">PolyAI</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" onClick={onClose}>
          {isMobile ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Back to Agents */}
      <div className="px-3 py-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to agents
        </Link>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {NAV_SECTIONS.map((section) => (
            <CollapsibleNavSection
              key={section.title}
              section={section}
              pathname={pathname}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <nav className="space-y-1">
          <Link
            href="https://docs.example.com"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Help Center
          </Link>
          <Link
            href="https://support.example.com"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Headphones className="h-4 w-4" />
            Contact Support
          </Link>
        </nav>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 z-30 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
