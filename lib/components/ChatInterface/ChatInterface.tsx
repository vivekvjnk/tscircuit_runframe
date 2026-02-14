import React, { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "lib/utils"
// Hooks
import { useAgentSocket, type WebSocketMessage, type AgentMessage } from "lib/hooks/use-agent-socket"
import { useChatSession } from "./hooks/useChatSession"
import { useAgentPresence } from "./hooks/useAgentPresence"
import { useAgentStatus } from "./hooks/useAgentStatus"
import type { ProjectUIState } from "./types"
// Components
import { ChatWindow } from "./components/ChatWindow"
import { ChatInputBar } from "./components/ChatInputBar"
import { ChatToggleBubble } from "./components/ChatToggleBubble"

// Helper
const createEvent = (type: any, payload: any, artifactId: string | null = null): AgentMessage => ({
    id: crypto.randomUUID(),
    type,
    artifact_id: artifactId,
    timestamp: new Date().toISOString(),
    source: "runtime",
    payload
})

export const ChatInterface = ({
    agentUrl = "ws://localhost:1080"
}: {
    agentUrl?: string
}) => {
    // UI State
    const [query, setQuery] = useState("")
    const [isMinimized, setIsMinimized] = useState(true)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(null)

    // Project State
    const [projectState, setProjectState] = useState<ProjectUIState>("NO_PROJECT")
    const [projectId, setProjectId] = useState<string | null>(null)
    const [projectName, setProjectName] = useState<string | null>(null)

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Domain Hooks
    const {
        messages,
        addUserMessage,
        addAssistantMessage,
        updateLastAssistantMessage,
        setError
    } = useChatSession()

    const { isAgentConnected, setConnected } = useAgentPresence()

    const {
        agentStatus,
        setAgentStatus,
        handleStatusMessage
    } = useAgentStatus()

    // Click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false)
                if (!isPinned) {
                    setIsHistoryOpen(false)
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isPinned])

    const effectiveShowHistory = !isMinimized && (isHistoryOpen || isFocused || isPinned)

    // Message Handler
    const handleAgentMessage = useCallback((msg: WebSocketMessage) => {
        console.log("Received message:", msg)

        // Presence
        if (msg.type === "AGENT_CONNECTED") {
            setConnected(true)
            return
        }
        if (msg.type === "AGENT_DISCONNECTED") {
            setConnected(false)
            return
        }

        const agentMsg = msg as AgentMessage
        if (agentMsg.artifact_id) {
            setCurrentArtifactId(agentMsg.artifact_id)
        }

        // Status Update
        handleStatusMessage(msg)

        // Message Content Updates
        switch (agentMsg.type) {
            case "EVALUATION_UPDATE":
                if (agentMsg.payload?.status === "running") {
                    updateLastAssistantMessage(agentMsg.payload?.text || "Evaluating...", "evaluating")
                }
                break

            case "ARTIFACT_UPDATED":
                const summary = agentMsg.payload?.summary || "Changes applied successfully!"
                updateLastAssistantMessage(summary, "completed")
                break

            case "AUTHORITY_REQUIRED":
                addAssistantMessage(agentMsg.payload?.question || "Action required.", "thinking")
                break

            case "HIL_REQUEST":
                addAssistantMessage(agentMsg.payload?.message || "Action required.", "thinking")
                break

            case "ERROR":
                addAssistantMessage(agentMsg.payload?.message || "An error occurred.", "error")
                break

            case "PROJECT_CREATED":
                setProjectId(agentMsg.payload?.project_id)
                setProjectName(agentMsg.payload?.project_name)
                setProjectState("AGENT_READY")
                addAssistantMessage("Agent workspace ready.", "completed")
                break

            case "VHL_WORKSPACE_READY":
                setProjectState("PROJECT_INITIALIZED")
                addAssistantMessage("VHL workspace ready.", "completed")
                break
        }
    }, [setConnected, handleStatusMessage, updateLastAssistantMessage, addAssistantMessage])

    const onOpen = useCallback((send: (msg: WebSocketMessage) => void) => {
        send({ type: "IDENTIFY", payload: { role: "ui" } })
    }, [])

    const { send, status: wsStatus } = useAgentSocket(agentUrl, handleAgentMessage, onOpen)

    // Actions
    const handleCreateProject = (name: string) => {
        setProjectName(name)
        setProjectState("CREATING_PROJECT")
        setIsHistoryOpen(true) // Ensure we see the menu
        send(createEvent("CREATE_PROJECT", { project_name: name }, null))
        addAssistantMessage("Creating project...", "thinking")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        const userMsg = query.trim()
        addUserMessage(userMsg)
        setQuery("")
        setIsHistoryOpen(true)

        if (wsStatus !== "open") {
            setError("I'm currently disconnected from the relay server. Please try again later.")
            return
        }

        if (!isAgentConnected) {
            setError("No agent is currently connected. Please wait for an agent.")
            return
        }

        send(createEvent("HUMAN_INPUT", {
            content: userMsg,
            intent: "freeform"
        }, currentArtifactId))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || wsStatus !== "open") return

        if (!isAgentConnected) {
            setError("No agent is currently connected. Cannot upload reference.")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64 = event.target?.result as string

            addUserMessage(`Uploaded ${file.name}`, base64)
            setIsHistoryOpen(true)

            send(createEvent("REFERENCE_UPLOADED", {
                reference_id: crypto.randomUUID(),
                reference_type: file.type.includes('image') ? 'image' : (file.type.includes('pdf') ? 'pdf' : 'other'),
                filename: file.name,
                base64: base64.split(',')[1]
            }, currentArtifactId))
        }
        reader.readAsDataURL(file)

        e.target.value = ""
    }

    const handleInterrupt = () => {
        if (!isAgentConnected) return
        send(createEvent("INTERRUPT_REQUEST", { reason: "user_requested_stop" }, currentArtifactId))
    }

    return (
        <div
            ref={containerRef}
            className="rf-absolute rf-bottom-6 rf-right-6 rf-z-[100] rf-flex rf-flex-col rf-items-end rf-gap-3"
        >
            {/* Chat Window */}
            {effectiveShowHistory && (
                <ChatWindow
                    messages={messages}
                    agentStatus={agentStatus}
                    isPinned={isPinned}
                    isAgentConnected={isAgentConnected}
                    wsStatus={wsStatus}
                    onTogglePin={() => setIsPinned(!isPinned)}
                    onClose={() => setIsHistoryOpen(false)}
                    onInterrupt={handleInterrupt}
                    projectState={projectState}
                    onCreateProject={handleCreateProject}
                    projectId={projectId}
                    projectName={projectName}
                />
            )}

            {/* Bubble / Input Bar */}
            <div
                className={cn(
                    "rf-relative rf-flex rf-items-center rf-transition-all rf-duration-500 rf-ease-in-out rf-shadow-2xl rf-border",
                    isMinimized
                        ? "rf-w-14 rf-h-14 rf-bg-blue-600 rf-rounded-full rf-border-blue-700 hover:rf-scale-110 hover:rf-bg-blue-700"
                        : "rf-w-[480px] rf-h-14 rf-bg-white rf-rounded-full rf-border-gray-100 rf-px-2"
                )}
            >
                <ChatToggleBubble
                    isMinimized={isMinimized}
                    onClick={() => {
                        if (isMinimized) {
                            setIsMinimized(false)
                            setTimeout(() => inputRef.current?.focus(), 100)
                        }
                    }}
                />

                {!isMinimized && (
                    <ChatInputBar
                        query={query}
                        setQuery={setQuery}
                        onSubmit={handleSubmit}
                        onFileUpload={handleFileUpload}
                        onMinimize={() => {
                            setIsMinimized(true)
                            setIsHistoryOpen(false)
                            setIsFocused(false)
                        }}
                        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                        isHistoryOpen={isHistoryOpen || isFocused || isPinned}
                        inputRef={inputRef}
                        disabled={projectState !== "PROJECT_INITIALIZED"}
                    />
                )}
            </div>
        </div>
    )
}
