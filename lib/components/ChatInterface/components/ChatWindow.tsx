import React from "react"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { AgentStatusBar } from "./AgentStatusBar"
import { ProjectInitializationMenu } from "./ProjectInitializationMenu"
import type { Message, AgentStatus, ProjectUIState } from "../types"

interface ChatWindowProps {
    messages: Message[]
    agentStatus: AgentStatus
    isPinned: boolean
    isAgentConnected: boolean
    wsStatus: "connecting" | "open" | "closed" | "error"
    onTogglePin: () => void
    onClose: () => void
    onInterrupt: () => void
    projectState: ProjectUIState
    onCreateProject: (name: string) => void
    projectId: string | null
    projectName: string | null
}

export const ChatWindow = ({
    messages,
    agentStatus,
    isPinned,
    isAgentConnected,
    wsStatus,
    onTogglePin,
    onClose,
    onInterrupt,
    projectState,
    onCreateProject,
    projectId,
    projectName
}: ChatWindowProps) => {
    /* 
       If we are not initialized, or if we are initialized but still showing the menu (because no chat yet?), 
       we prioritize the ProjectInitializationMenu.
       The prompt says: "Replace chat history content... when no project is active". 
       Also: "Transition to PROJECT_INITIALIZED... Reveal new buttons".
       So for this milestone, we likely stay in this view.
    */
    const showProjectMenu = projectState !== "PROJECT_INITIALIZED" || (projectState === "PROJECT_INITIALIZED" && messages.length <= 1)
    // messages.length <= 1 because usually there's an initial greeting? "Hello! How can I help..."
    // If the user hasn't chatted, we might want to show the menu/buttons.
    // However, the prompt implies the menu structure persists to show the buttons.

    // Let's simplified: Always show ProjectMenu content instead of MessageList 
    // if projectState != PROJECT_INITIALIZED?
    // Or if projectState IS PROJECT_INITIALIZED, we show the buttons. 
    // Let's rely on ProjectInitializationMenu to render null if it shouldn't show?
    // No, ProjectInitializationMenu has logic for PROJECT_INITIALIZED.

    // I will render ProjectInitializationMenu IF keeping the menu logic.
    // But wait, "Do not remove chat capability".

    // Strategy: Render ProjectInitializationMenu. If it returns content, show it.
    // But it's a component.

    // Let's just conditionally render:
    // If projectState is NOT "PROJECT_INITIALIZED" -> Show Menu
    // If projectState IS "PROJECT_INITIALIZED" -> Show Menu (with buttons).
    // The chat history (MessageList) will be hidden for now in this Milestone logic? 
    // Or maybe we render it below?

    // The prompt: "Replace chat history content...". 
    // "UI Behavior... When state === NO_PROJECT: Replace chat history". 
    // It doesn't explicitly say "When state === PROJECT_INITIALIZED: Restore chat history".
    // It says "Reveal new buttons".

    return (
        <div className="rf-w-[400px] rf-h-[500px] rf-bg-white rf-rounded-2xl rf-shadow-2xl rf-border rf-border-gray-100 rf-flex rf-flex-col rf-overflow-hidden rf-animate-in rf-fade-in rf-slide-in-from-bottom-4">
            <ChatHeader
                isPinned={isPinned}
                onTogglePin={onTogglePin}
                onClose={onClose}
                isAgentConnected={isAgentConnected}
                wsStatus={wsStatus}
            />

            {(projectState === "NO_PROJECT" ||
                projectState === "CREATING_PROJECT" ||
                projectState === "AGENT_READY" ||
                projectState === "VHL_READY" ||
                projectState === "PROJECT_INITIALIZED") ? (
                <ProjectInitializationMenu
                    projectState={projectState}
                    onCreateProject={onCreateProject}
                    projectId={projectId}
                    projectName={projectName}
                />
            ) : (
                <MessageList messages={messages} />
            )}

            <AgentStatusBar agentStatus={agentStatus} onInterrupt={onInterrupt} />
        </div>
    )
}
