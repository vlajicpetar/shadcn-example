"use client";

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
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Manage",
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
    items: [
      { label: "Overview", href: "/analytics", icon: LayoutDashboard },
    ],
  },
  {
    title: "Build",
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
    items: [
      { label: "Agent voice", href: "/agent-voice", icon: Volume2 },
      { label: "Audio management", href: "/audio-management", icon: AudioLines },
      { label: "Response control", href: "/response-control", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Configure",
    items: [
      { label: "Environments", href: "/environments", icon: Server },
      { label: "Numbers", href: "/numbers", icon: Phone },
      { label: "Project history", href: "/project-history", icon: History },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="!bg-[rgb(22,22,23)] border-r-0 [&_[data-sidebar=sidebar]]:bg-[rgb(22,22,23)]"
      {...props}
    >
      <SidebarHeader className="border-b border-white/10 bg-[rgb(22,22,23)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/10" tooltip="PolyAI">
              <Link href="/">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white font-semibold text-sm shrink-0">
                  PA
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-white">PolyAI</span>
                  <span className="text-xs text-white/50">Agent Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[rgb(22,22,23)]">
        {NAV_SECTIONS.map((section) => (
          <Collapsible key={section.title} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild className="text-white/50 hover:text-white/70 hover:bg-white/5">
                <CollapsibleTrigger className="flex w-full items-center">
                  {section.title}
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                            className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white"
                          >
                            <Link href={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge className="ml-auto bg-white/10 text-white/70 text-[10px] px-1.5 py-0 hover:bg-white/20">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[rgb(22,22,23)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help Center" className="hover:bg-white/10">
              <Link
                href="https://docs.example.com"
                target="_blank"
                className="text-white/70 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Contact Support" className="hover:bg-white/10">
              <Link
                href="https://support.example.com"
                target="_blank"
                className="text-white/70 hover:text-white"
              >
                <Headphones className="h-4 w-4" />
                <span>Contact Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
