"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Import,
  Download,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Copy,
  Pencil,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface ExampleQuery {
  id: string;
  value: string;
}

interface Topic {
  id: string;
  name: string;
  content: string;
  actions: string;
  exampleQueries: ExampleQuery[];
  createdAt?: Date;
  updatedAt?: Date;
}

// UI Copy
const UI_COPY = {
  pageTitle: "Knowledge base",
  pageDescription:
    "Create and manage agent topics containing information and actions.",
  button: {
    import: "Import",
    export: "Export",
    addFirst: "Add topic",
    add: "Topic",
  },
  topicCount: (count: number) =>
    count === 0 ? "No topics" : `${count} topic${count !== 1 ? "s" : ""}`,
  empty: {
    title: "You don't have any topics",
    description: 'Press the "Add topic" button to create your first topic',
    noMatching: {
      title: "No topics match your search",
      description: 'Press the "Add topic" button to add the topic you want',
    },
  },
  card: {
    popupMenu: {
      duplicate: "Duplicate",
      rename: "Rename",
      delete: "Delete",
    },
    form: {
      name: {
        placeholder: "Please give this topic a name...",
      },
      content: {
        label: "Content",
        helpText:
          "This is the content of the topic, which will determine whether or not it is relevant to the user",
      },
      exampleQueries: {
        label: "Sample questions",
        helpText:
          "Example inputs that users might provide, which will help the agent retrieve relevant topics.",
      },
      actions: {
        label: "Actions",
        helpText:
          "These are the actions that the agent will be prompted to execute if the content is deemed relevant",
      },
    },
    modal: {
      delete: {
        title: "Delete this card?",
        description: "This card and its content will be deleted permanently.",
      },
    },
  },
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock initial data
const INITIAL_TOPICS: Topic[] = [
  {
    id: generateId(),
    name: "Greeting and Introduction",
    content:
      "When a user initiates a conversation, greet them warmly and introduce yourself as an AI assistant. Ask how you can help them today.",
    actions: "",
    exampleQueries: [
      { id: generateId(), value: "Hello" },
      { id: generateId(), value: "Hi there" },
      { id: generateId(), value: "Good morning" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: generateId(),
    name: "Product Information",
    content:
      "Provide detailed information about our products including features, pricing, and availability. Always check the latest inventory before confirming stock.",
    actions: "check_inventory, get_product_details",
    exampleQueries: [
      { id: generateId(), value: "What products do you have?" },
      { id: generateId(), value: "Tell me about your pricing" },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: generateId(),
    name: "Order Status",
    content:
      "Help users track their orders by looking up order status using their order number or email address. Provide estimated delivery dates when available.",
    actions: "lookup_order, get_tracking_info",
    exampleQueries: [
      { id: generateId(), value: "Where is my order?" },
      { id: generateId(), value: "Track my package" },
      { id: generateId(), value: "When will my order arrive?" },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
  },
];

// Topic Card Component
function TopicCard({
  topic,
  isOpen,
  onToggle,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  topic: Topic;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (topic: Topic) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [showMoreQueries, setShowMoreQueries] = useState(false);
  const [showActions, setShowActions] = useState(!!topic.actions);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleNameChange = (value: string) => {
    onUpdate({ ...topic, name: value });
  };

  const handleContentChange = (value: string) => {
    onUpdate({ ...topic, content: value });
  };

  const handleActionsChange = (value: string) => {
    onUpdate({ ...topic, actions: value });
  };

  const handleExampleQueryChange = (index: number, value: string) => {
    const newQueries = [...topic.exampleQueries];
    newQueries[index] = { ...newQueries[index], value };

    // Auto-add new empty field if typing in the last field
    if (index === topic.exampleQueries.length - 1 && value && topic.exampleQueries.length < 10) {
      newQueries.push({ id: generateId(), value: "" });
    }

    onUpdate({ ...topic, exampleQueries: newQueries });
  };

  const handleDeleteExampleQuery = (index: number) => {
    if (topic.exampleQueries.length <= 1) return;
    const newQueries = topic.exampleQueries.filter((_, i) => i !== index);
    onUpdate({ ...topic, exampleQueries: newQueries });
  };

  const visibleQueries = showMoreQueries
    ? topic.exampleQueries
    : topic.exampleQueries.slice(0, 1);
  const hasMoreQueries = topic.exampleQueries.length > 1;

  return (
    <Card className="border border-border">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-in-out",
                    isOpen && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              <Input
                value={topic.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={UI_COPY.card.form.name.placeholder}
                className="border-0 p-0 h-auto font-semibold text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Saved
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    {UI_COPY.card.popupMenu.duplicate}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {UI_COPY.card.popupMenu.rename}
                  </DropdownMenuItem>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {UI_COPY.card.popupMenu.delete}
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{UI_COPY.card.modal.delete.title}</DialogTitle>
                        <DialogDescription>
                          {UI_COPY.card.modal.delete.description}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            onDelete();
                            setDeleteDialogOpen(false);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 overflow-hidden transition-all duration-300 ease-in-out">
          <CardContent className="space-y-4 pt-2">
            {/* Example Queries */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {UI_COPY.card.form.exampleQueries.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {UI_COPY.card.form.exampleQueries.helpText}
              </p>
              <div className="space-y-2">
                {visibleQueries.map((query, index) => (
                  <div key={query.id} className="flex items-center gap-2">
                    <Input
                      value={query.value}
                      onChange={(e) =>
                        handleExampleQueryChange(
                          showMoreQueries ? index : index,
                          e.target.value
                        )
                      }
                      placeholder="Enter a sample question..."
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() =>
                        handleDeleteExampleQuery(showMoreQueries ? index : index)
                      }
                      disabled={topic.exampleQueries.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              {hasMoreQueries && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                  onClick={() => setShowMoreQueries(!showMoreQueries)}
                >
                  {showMoreQueries ? (
                    <>
                      <ChevronUp className="mr-1 h-4 w-4" />
                      View less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-4 w-4" />
                      View more ({topic.exampleQueries.length - 1} more)
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {UI_COPY.card.form.content.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {UI_COPY.card.form.content.helpText}
              </p>
              <Textarea
                value={topic.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter topic content..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Actions */}
            {!showActions ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={() => setShowActions(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Actions
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {UI_COPY.card.form.actions.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {UI_COPY.card.form.actions.helpText}
                </p>
                <Textarea
                  value={topic.actions}
                  onChange={(e) => handleActionsChange(e.target.value)}
                  placeholder="Enter actions..."
                  className="min-h-[80px] resize-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-destructive hover:text-destructive"
                  onClick={() => {
                    setShowActions(false);
                    onUpdate({ ...topic, actions: "" });
                  }}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove actions
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Empty State Component
function EmptyState({
  title,
  description,
  onAddTopic,
}: {
  title: string;
  description: string;
  onAddTopic: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        <Button onClick={onAddTopic}>
          <Plus className="mr-2 h-4 w-4" />
          {UI_COPY.button.addFirst}
        </Button>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
      ))}
    </div>
  );
}

// Main Knowledge Base Page
export default function KnowledgeBasePage() {
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("newest");
  const [collapseStates, setCollapseStates] = useState<Record<string, boolean>>(
    () => {
      const states: Record<string, boolean> = {};
      INITIAL_TOPICS.forEach((topic) => {
        states[topic.id] = true;
      });
      return states;
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    let result = topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchInput.toLowerCase())
    );

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            (a.updatedAt?.getTime() || 0) - (b.updatedAt?.getTime() || 0)
        );
        break;
    }

    return result;
  }, [topics, searchInput, sortBy]);

  const allCollapsed = useMemo(
    () => Object.values(collapseStates).every((x) => !x),
    [collapseStates]
  );

  const addTopic = useCallback(() => {
    const newTopic: Topic = {
      id: generateId(),
      name: "",
      content: "",
      actions: "",
      exampleQueries: [{ id: generateId(), value: "" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTopics((prev) => [newTopic, ...prev]);
    setCollapseStates((prev) => ({ ...prev, [newTopic.id]: true }));
  }, []);

  const updateTopic = useCallback((updatedTopic: Topic) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === updatedTopic.id
          ? { ...updatedTopic, updatedAt: new Date() }
          : t
      )
    );
  }, []);

  const deleteTopic = useCallback((topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    setCollapseStates((prev) => {
      const newStates = { ...prev };
      delete newStates[topicId];
      return newStates;
    });
  }, []);

  const duplicateTopic = useCallback((topic: Topic) => {
    const newTopic: Topic = {
      ...topic,
      id: generateId(),
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      exampleQueries: topic.exampleQueries.map((q) => ({
        ...q,
        id: generateId(),
      })),
    };
    setTopics((prev) => [newTopic, ...prev]);
    setCollapseStates((prev) => ({ ...prev, [newTopic.id]: true }));
  }, []);

  const toggleCollapseAll = useCallback(() => {
    const newState = allCollapsed;
    setCollapseStates((prev) => {
      const newStates: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newStates[key] = newState;
      });
      topics.forEach((topic) => {
        newStates[topic.id] = newState;
      });
      return newStates;
    });
  }, [allCollapsed, topics]);

  const toggleTopic = useCallback((topicId: string) => {
    setCollapseStates((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  }, []);

  const isEmpty = topics.length === 0;
  const noMatchingTopics = filteredTopics.length === 0 && topics.length > 0;

  return (
    <AppLayout projectName="My Agent" language="English (US)" showDraftHeader isSaved>
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {UI_COPY.pageTitle}
              </h1>
              <p className="text-muted-foreground mt-1">
                {UI_COPY.pageDescription}
              </p>
              <p className="text-sm font-semibold text-muted-foreground mt-2">
                {UI_COPY.topicCount(topics.length)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Import className="mr-2 h-4 w-4" />
                    {UI_COPY.button.import}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>From CSV</DropdownMenuItem>
                  <DropdownMenuItem>From URL</DropdownMenuItem>
                  <DropdownMenuItem>From PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      disabled={topics.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {UI_COPY.button.export}
                    </Button>
                  </span>
                </TooltipTrigger>
                {topics.length === 0 && (
                  <TooltipContent>
                    <p>Add information to this page to be able to export it</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search topics..."
                className="pl-9 w-[200px]"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as typeof sortBy)
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">A-Z</SelectItem>
                <SelectItem value="name-desc">Z-A</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold"
            onClick={toggleCollapseAll}
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : isEmpty ? (
          <EmptyState
            title={UI_COPY.empty.title}
            description={UI_COPY.empty.description}
            onAddTopic={addTopic}
          />
        ) : noMatchingTopics ? (
          <EmptyState
            title={UI_COPY.empty.noMatching.title}
            description={UI_COPY.empty.noMatching.description}
            onAddTopic={addTopic}
          />
        ) : (
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isOpen={collapseStates[topic.id] ?? true}
                onToggle={() => toggleTopic(topic.id)}
                onUpdate={updateTopic}
                onDelete={() => deleteTopic(topic.id)}
                onDuplicate={() => duplicateTopic(topic)}
              />
            ))}
          </div>
        )}

        {/* Floating Add Topic Button */}
        {!isEmpty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
            <Button onClick={addTopic} size="lg" className="shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              {UI_COPY.button.add}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
