"use client";

import { motion } from "framer-motion";
import { Network, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TreeView } from "@/components/tree-view";
import { ChatView } from "@/components/chat-view";
import { fadeIn } from "@/lib/transitions";
import type { TreeNode, TreeStats, ChatMessage } from "@/lib/types";

interface CenterPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  treeData: TreeNode[] | null;
  treeLoading: boolean;
  treeError: string | null;
  treeProcessing: boolean;
  treeStats: TreeStats | null;
  docName: string | null;
  chatMessages: ChatMessage[];
  isStreaming: boolean;
  hasSelectedDoc: boolean;
  onSendMessage: (content: string) => void;
  chatInputValue: string;
  setChatInputValue: (val: string) => void;
}

export function CenterPanel(props: CenterPanelProps) {
  const {
    activeTab, onTabChange, treeData, treeLoading, treeError,
    treeProcessing, treeStats, docName, chatMessages, isStreaming,
    hasSelectedDoc, onSendMessage, chatInputValue, setChatInputValue
  } = props;

  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex min-w-0 flex-1 flex-col bg-background"
      id="center-panel"
    >
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-0 w-fit rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="tree"
            className="gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Network className="size-3.5" />
            Document Tree
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <MessageSquare className="size-3.5" />
            Chat
            {isStreaming ? (
              <Badge variant="default" className="size-2 animate-pulse rounded-full p-0" />
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
          <TreeView
            treeData={treeData}
            isLoading={treeLoading}
            error={treeError}
            isProcessing={treeProcessing}
            stats={treeStats}
            docName={docName}
          />
        </TabsContent>

        <TabsContent value="chat" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
          <ChatView
            messages={chatMessages}
            isStreaming={isStreaming}
            hasSelectedDoc={hasSelectedDoc}
            onSendMessage={onSendMessage}
            inputValue={chatInputValue}
            onInputChange={setChatInputValue}
          />
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}
