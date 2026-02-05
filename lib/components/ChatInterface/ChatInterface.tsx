import React, { useState, useEffect, useCallback, useRef } from "react"
import { Search, Send, X, MessageSquare, Sparkles, Loader2, CheckCircle2, AlertCircle, Terminal, Image as ImageIcon, Pin, PinOff, ChevronUp, ChevronDown, Minimize2 } from "lucide-react"
import { cn } from "lib/utils"
import { useAgentSocket, type WebSocketMessage, type AgentMessage } from "lib/hooks/use-agent-socket"

interface Message {
    role: "user" | "assistant"
    content: string
    status?: "thinking" | "evaluating" | "completed" | "error"
    image?: string
}

const createEvent = (type: any, payload: any, artifactId: string | null = null): AgentMessage => ({
    id: crypto.randomUUID(),
    type,
    artifact_id: artifactId,
    timestamp: new Date().toISOString(),
    source: "runtime",
    payload
})

export const ChatInterface = ({
    agentUrl = "ws://localhost:8080"
}: {
    agentUrl?: string
}) => {
    const [query, setQuery] = useState("")
    const [isMinimized, setIsMinimized] = useState(true)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you with your circuit design today?" }
    ])
    const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "evaluating" | "failed">("idle")
    const [isPinned, setIsPinned] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isAgentConnected, setIsAgentConnected] = useState(false)
    const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(null)

    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Click outside detection
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // If clicked outside, stop focus and hide history if not pinned
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

    const handleAgentMessage = useCallback((msg: WebSocketMessage) => {
        console.log("Received message:", msg)

        // Presence Handling (Transport-only)
        if (msg.type === "AGENT_CONNECTED") {
            setIsAgentConnected(true)
            return
        }
        if (msg.type === "AGENT_DISCONNECTED") {
            setIsAgentConnected(false)
            return
        }

        const agentMsg = msg as AgentMessage
        if (agentMsg.artifact_id) {
            setCurrentArtifactId(agentMsg.artifact_id)
        }

        switch (agentMsg.type) {
            case "STATE_TRANSITION":
                // Rule: derive status from phase/state
                if (agentMsg.payload?.to === "THINKING") {
                    setAgentStatus("thinking")
                } else if (agentMsg.payload?.to === "IDLE") {
                    setAgentStatus("idle")
                }
                break

            case "EVALUATION_UPDATE":
                // Rule: derive spinner/terminal from status=running
                if (agentMsg.payload?.status === "running") {
                    setAgentStatus("evaluating")
                    setMessages(prev => {
                        const last = prev[prev.length - 1]
                        if (last && last.role === "assistant" && (last.status === "thinking" || last.status === "evaluating")) {
                            return [...prev.slice(0, -1), { ...last, content: agentMsg.payload?.text || "Evaluating...", status: "evaluating" }]
                        }
                        return [...prev, { role: "assistant", content: agentMsg.payload?.text || "Evaluating...", status: "evaluating" }]
                    })
                } else if (agentMsg.payload?.status === "pass") {
                    setAgentStatus("idle")
                    // Success is typically handled by ARTIFACT_UPDATED but can be noted here
                }
                break

            case "ARTIFACT_UPDATED":
                // Rule: Show success/update
                setAgentStatus("idle")
                setMessages(prev => {
                    const last = prev[prev.length - 1]
                    const content = agentMsg.payload?.summary || "Changes applied successfully!"
                    if (last && last.role === "assistant" && (last.status === "thinking" || last.status === "evaluating")) {
                        return [...prev.slice(0, -1), { ...last, content, status: "completed" }]
                    }
                    return [...prev, { role: "assistant", content, status: "completed" }]
                })
                break

            case "AUTHORITY_REQUIRED":
                // Rule: Blocking prompt
                setAgentStatus("idle")
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: agentMsg.payload?.question || "Action required.",
                    status: "thinking" // Or a new status for "waiting"
                }])
                break

            case "ERROR":
                setAgentStatus("failed")
                setMessages(prev => [...prev, { role: "assistant", content: agentMsg.payload?.message || "An error occurred.", status: "error" }])
                break
        }
    }, [])

    const onOpen = useCallback((send: (msg: WebSocketMessage) => void) => {
        send({ type: "IDENTIFY", payload: { role: "ui" } })
    }, [])

    const { send, status: wsStatus } = useAgentSocket(agentUrl, handleAgentMessage, onOpen)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        const userMsg = query.trim()
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setQuery("")

        // Ensure history is visible when sending
        setIsHistoryOpen(true)

        if (wsStatus !== "open") {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm currently disconnected from the relay server. Please try again later.",
                status: "error"
            }])
            return
        }

        if (!isAgentConnected) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "No agent is currently connected. Please wait for an agent.",
                status: "error"
            }])
            return
        }

        // Rule: Emit HUMAN_INPUT
        send(createEvent("HUMAN_INPUT", {
            content: userMsg,
            intent: "freeform"
        }, currentArtifactId))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || wsStatus !== "open") return

        if (!isAgentConnected) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "No agent is currently connected. Cannot upload reference.",
                status: "error"
            }])
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64 = event.target?.result as string

            // Add to messages UI
            setMessages(prev => [...prev, {
                role: "user",
                content: `Uploaded ${file.name}`,
                image: base64
            }])
            setIsHistoryOpen(true)

            // Rule: Emit REFERENCE_UPLOADED
            send(createEvent("REFERENCE_UPLOADED", {
                reference_id: crypto.randomUUID(),
                reference_type: file.type.includes('image') ? 'image' : (file.type.includes('pdf') ? 'pdf' : 'other'),
                filename: file.name,
                base64: base64.split(',')[1] // Still need to carry data for the agent
            }, currentArtifactId))
        }
        reader.readAsDataURL(file)

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleInterrupt = () => {
        if (!isAgentConnected) return

        // Rule: Emit INTERRUPT_REQUEST
        send(createEvent("INTERRUPT_REQUEST", {
            reason: "user_requested_stop"
        }, currentArtifactId))
    }

    return (
        <div
            ref={containerRef}
            className="rf-absolute rf-bottom-6 rf-right-6 rf-z-[100] rf-flex rf-flex-col rf-items-end rf-gap-3"
        >
            {/* Chat Window */}
            {effectiveShowHistory && (
                <div className="rf-w-[400px] rf-h-[500px] rf-bg-white rf-rounded-2xl rf-shadow-2xl rf-border rf-border-gray-100 rf-flex rf-flex-col rf-overflow-hidden rf-animate-in rf-fade-in rf-slide-in-from-bottom-4">
                    <div className="rf-p-4 rf-border-b rf-bg-gray-50/50 rf-flex rf-items-center rf-justify-between">
                        <div className="rf-flex rf-items-center rf-gap-2">
                            <div className="rf-bg-blue-600 rf-p-1.5 rf-rounded-lg">
                                <Sparkles className="rf-w-4 rf-h-4 rf-text-white" />
                            </div>
                            <div>
                                <h3 className="rf-font-semibold rf-text-sm rf-text-gray-800">tscircuit AI Assistant</h3>
                                <div className="rf-flex rf-items-center rf-gap-1.5">
                                    <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", wsStatus === "open" ? (isAgentConnected ? "rf-bg-green-500" : "rf-bg-yellow-500") : "rf-bg-red-500")} />
                                    <span className="rf-text-[10px] rf-text-gray-500 rf-uppercase rf-tracking-wider">
                                        {wsStatus === "open" ? (isAgentConnected ? "Agent Ready" : "Waiting for Agent") : "Disconnected"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="rf-flex rf-items-center rf-gap-2">
                            <button
                                onClick={() => setIsPinned(!isPinned)}
                                className={cn(
                                    "rf-p-1 rf-rounded-lg rf-transition-colors",
                                    isPinned ? "rf-bg-blue-100 rf-text-blue-600" : "rf-text-gray-400 hover:rf-bg-gray-200"
                                )}
                                title={isPinned ? "Unpin chat" : "Pin chat"}
                            >
                                {isPinned ? <Pin className="rf-w-4 rf-h-4" /> : <PinOff className="rf-w-4 rf-h-4" />}
                            </button>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="rf-p-1 rf-rounded-lg hover:rf-bg-gray-200 rf-transition-colors"
                            >
                                <X className="rf-w-4 rf-h-4 rf-text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="rf-flex-grow rf-p-4 rf-overflow-y-auto rf-bg-gray-50/30 rf-flex rf-flex-col rf-gap-4"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rf-flex rf-flex-col rf-gap-1.5 rf-max-w-[85%]",
                                    msg.role === "user" ? "rf-self-end rf-items-end" : "rf-self-start rf-items-start"
                                )}
                            >
                                <div className={cn(
                                    "rf-p-3 rf-rounded-2xl rf-text-sm rf-shadow-sm rf-border",
                                    msg.role === "user"
                                        ? "rf-bg-blue-600 rf-text-white rf-border-blue-700 rf-rounded-tr-none"
                                        : "rf-bg-white rf-text-gray-700 rf-border-gray-100 rf-rounded-tl-none"
                                )}>
                                    {msg.image && (
                                        <div className="rf-mb-2 rf-rounded-lg rf-overflow-hidden rf-border rf-border-white/20">
                                            <img src={msg.image} alt="Uploaded" className="rf-w-full rf-h-auto" />
                                        </div>
                                    )}
                                    {msg.content}

                                    {msg.status && msg.status !== "completed" && (
                                        <div className="rf-mt-2 rf-flex rf-items-center rf-gap-2 rf-text-[11px] rf-font-medium rf-opacity-80">
                                            {msg.status === "thinking" && <Loader2 className="rf-w-3 rf-h-3 rf-animate-spin" />}
                                            {msg.status === "evaluating" && <Terminal className="rf-w-3 rf-h-3" />}
                                            <span className="rf-capitalize">{msg.status}...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {agentStatus !== "idle" && (
                        <div className="rf-px-4 rf-py-2 rf-bg-blue-50/50 rf-border-t rf-border-blue-100 rf-flex rf-items-center rf-justify-between">
                            <div className="rf-flex rf-items-center rf-gap-2">
                                <Loader2 className="rf-w-3.5 rf-h-3.5 rf-animate-spin rf-text-blue-600" />
                                <span className="rf-text-xs rf-font-medium rf-text-blue-700">
                                    {agentStatus === "thinking" ? "Agent is processing..." : "Validating changes..."}
                                </span>
                            </div>
                            <button
                                onClick={handleInterrupt}
                                className="rf-text-xs rf-text-blue-600 hover:rf-text-blue-800 rf-font-semibold"
                            >
                                Stop
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Bubble / Search Bar Toggle Container */}
            <div
                className={cn(
                    "rf-relative rf-flex rf-items-center rf-transition-all rf-duration-500 rf-ease-in-out rf-shadow-2xl rf-border",
                    isMinimized
                        ? "rf-w-14 rf-h-14 rf-bg-blue-600 rf-rounded-full rf-border-blue-700 hover:rf-scale-110 hover:rf-bg-blue-700"
                        : "rf-w-[480px] rf-h-14 rf-bg-white rf-rounded-full rf-border-gray-100 rf-px-2"
                )}
            >
                {/* Persistent Logo / Expansion Trigger */}
                <button
                    onClick={() => {
                        if (isMinimized) {
                            setIsMinimized(false)
                            setTimeout(() => inputRef.current?.focus(), 100)
                        }
                    }}
                    className={cn(
                        "rf-flex rf-items-center rf-justify-center rf-transition-all rf-duration-500 rf-flex-shrink-0",
                        isMinimized
                            ? "rf-w-full rf-h-full"
                            : "rf-w-9 rf-h-9 rf-bg-blue-600 rf-rounded-full rf-ml-0.5"
                    )}
                >
                    <Sparkles className={cn(
                        "rf-text-white rf-transition-all rf-duration-500",
                        isMinimized ? "rf-w-6 rf-h-6" : "rf-w-4 rf-h-4"
                    )} />
                </button>

                {/* Form Elements (Visible only when not minimized) */}
                {!isMinimized && (
                    <div className="rf-flex rf-items-center rf-flex-grow rf-animate-in rf-fade-in rf-duration-700 rf-delay-150">
                        <form
                            onSubmit={handleSubmit}
                            className="rf-flex rf-items-center rf-flex-grow rf-ml-2"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="rf-hidden"
                                accept="image/*,.pdf"
                            />

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => {
                                    setTimeout(() => setIsFocused(false), 200)
                                }}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask tscircuit AI..."
                                className="rf-flex-grow rf-bg-transparent rf-outline-none rf-text-sm rf-text-gray-700 placeholder:rf-text-gray-400 rf-py-2"
                            />

                            <div className="rf-flex rf-items-center rf-gap-1 rf-ml-2">
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        className="rf-p-1 rf-rounded-full hover:rf-bg-gray-100 rf-transition-colors"
                                    >
                                        <X className="rf-w-3.5 rf-h-3.5 rf-text-gray-400" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rf-p-1.5 rf-rounded-full hover:rf-bg-gray-100 rf-transition-colors rf-text-gray-400 hover:rf-text-blue-500"
                                    title="Upload documentation"
                                >
                                    <ImageIcon className="rf-w-4 rf-h-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                    className={cn(
                                        "rf-p-1.5 rf-rounded-full rf-transition-colors",
                                        isHistoryOpen || isFocused || isPinned ? "rf-text-blue-600 rf-bg-blue-50" : "rf-text-gray-400 hover:rf-bg-gray-100"
                                    )}
                                    title="Toggle chat history"
                                >
                                    {effectiveShowHistory ? <ChevronDown className="rf-w-4 rf-h-4" /> : <ChevronUp className="rf-w-4 rf-h-4" />}
                                </button>
                            </div>

                            <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-2" />

                            <button
                                type="submit"
                                className={cn(
                                    "rf-p-2 rf-rounded-full rf-transition-all",
                                    query.trim() ? "rf-bg-blue-600 rf-text-white rf-shadow-md" : "rf-bg-gray-50 rf-text-gray-300"
                                )}
                                disabled={!query.trim()}
                            >
                                <Send className="rf-w-3.5 rf-h-3.5" />
                            </button>

                            <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-2" />

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsMinimized(true)
                                    setIsHistoryOpen(false)
                                    setIsFocused(false)
                                }}
                                className="rf-p-2 rf-rounded-full hover:rf-bg-gray-100 rf-text-gray-400 hover:rf-text-red-500 rf-transition-colors"
                                title="Minimize to bubble"
                            >
                                <Minimize2 className="rf-w-3.5 rf-h-3.5" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
