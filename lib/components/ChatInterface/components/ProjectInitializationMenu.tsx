import React, { useState } from "react"
import type { ProjectUIState } from "../types"
import { cn } from "lib/utils"

interface ProjectInitializationMenuProps {
    projectState: ProjectUIState
    onCreateProject: (name: string) => void
    onLoadProject: (id: string) => void
    onSynthesize: () => void
    projectId: string | null
    projectName: string | null
    availableProjects: string[]
    isSynthesizable: boolean
}

export const ProjectInitializationMenu = ({
    projectState,
    onCreateProject,
    onLoadProject,
    onSynthesize,
    projectId,
    projectName,
    availableProjects,
    isSynthesizable
}: ProjectInitializationMenuProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [localProjectName, setLocalProjectName] = useState("")

    const handleCreateClick = () => {
        setIsCreating(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (localProjectName.trim()) {
            onCreateProject(localProjectName.trim())
        }
    }

    /* 
       Project Menu States:
       - NO_PROJECT: Show "Create Project" button
       - CREATING_PROJECT: Show "Creating project..."
       - AGENT_READY: Show "Agent workspace ready."
       - VHL_READY / PROJECT_INITIALIZED: Show "VHL workspace ready." + Upload buttons
    */

    return (
        <div className="rf-flex rf-flex-col rf-items-center rf-justify-center rf-h-full rf-p-6 rf-gap-4 rf-text-gray-600 rf-bg-white rf-overflow-y-auto rf-custom-scrollbar">
            {projectState === "NO_PROJECT" && !isCreating && (
                <div className="rf-flex rf-flex-col rf-gap-5 rf-w-full rf-max-w-[320px] rf-animate-in rf-fade-in rf-slide-in-from-bottom-2">
                    <div className="rf-flex rf-flex-col rf-items-center rf-gap-2 rf-mb-2">
                        <div className="rf-w-12 rf-h-12 rf-bg-blue-50 rf-rounded-2xl rf-flex rf-items-center rf-justify-center rf-text-2xl">⚡</div>
                        <div className="rf-text-xl rf-font-bold rf-text-gray-900">Get Started</div>
                        <div className="rf-text-sm rf-text-gray-400">Open an existing project or create a new one</div>
                    </div>

                    <div className="rf-flex rf-flex-col rf-gap-3">
                        <div className="rf-flex rf-items-center rf-justify-between rf-px-1">
                            <span className="rf-text-[11px] rf-font-bold rf-text-gray-400 rf-uppercase rf-tracking-widest">Available Projects</span>
                            <span className="rf-text-[10px] rf-px-1.5 rf-py-0.5 rf-bg-gray-100 rf-text-gray-500 rf-rounded-md">{availableProjects.length}</span>
                        </div>

                        <div className="rf-flex rf-flex-col rf-gap-2 rf-max-h-[220px] rf-overflow-y-auto rf-pr-1 rf-custom-scrollbar">
                            {availableProjects.length > 0 ? (
                                availableProjects.map(id => (
                                    <button
                                        key={id}
                                        onClick={() => onLoadProject(id)}
                                        className="rf-flex rf-items-center rf-gap-3 rf-px-4 rf-py-3 rf-bg-gray-50/50 rf-border rf-border-gray-100 rf-rounded-2xl hover:rf-bg-blue-50 hover:rf-border-blue-200 rf-transition-all rf-group hover:rf-shadow-sm"
                                    >
                                        <div className="rf-w-10 rf-h-10 rf-bg-white rf-rounded-xl rf-flex rf-items-center rf-justify-center rf-text-xl group-hover:rf-scale-110 rf-transition-transform rf-shadow-sm">📁</div>
                                        <div className="rf-flex-1 rf-text-left rf-truncate">
                                            <div className="rf-text-sm rf-font-semibold rf-text-gray-700 group-hover:rf-text-blue-700 rf-truncate">{id}</div>
                                            <div className="rf-text-[10px] rf-text-gray-400">Ready to design</div>
                                        </div>
                                        <div className="rf-opacity-0 group-hover:rf-opacity-100 rf-transition-opacity rf-text-blue-500">→</div>
                                    </button>
                                ))
                            ) : (
                                <div className="rf-py-10 rf-text-center rf-bg-gray-50/50 rf-rounded-2xl rf-border rf-border-dashed rf-border-gray-200">
                                    <div className="rf-text-3xl rf-mb-2 rf-opacity-30">📂</div>
                                    <div className="rf-text-xs rf-text-gray-400">No projects found in workspace</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rf-relative rf-py-1">
                        <div className="rf-absolute rf-inset-0 rf-flex rf-items-center"><div className="rf-w-full rf-border-t rf-border-gray-100" /></div>
                        <div className="rf-relative rf-flex rf-justify-center"><span className="rf-bg-white rf-px-3 rf-text-[10px] rf-font-bold rf-text-gray-300 rf-uppercase">or spawn new</span></div>
                    </div>

                    <button
                        onClick={handleCreateClick}
                        className="rf-flex rf-items-center rf-justify-center rf-gap-2 rf-px-4 rf-py-4 rf-bg-blue-600 rf-text-white rf-rounded-2xl hover:rf-bg-blue-700 rf-transition-all rf-shadow-blue-200 rf-shadow-lg hover:rf-shadow-blue-300 rf-font-bold rf-text-sm"
                    >
                        <span>✨</span>
                        Create Project
                    </button>
                </div>
            )}

            {projectState === "NO_PROJECT" && isCreating && (
                <form onSubmit={handleSubmit} className="rf-flex rf-flex-col rf-gap-3 rf-w-full rf-max-w-[240px] rf-animate-in rf-fade-in rf-slide-in-from-bottom-2">
                    <label className="rf-text-sm rf-font-medium rf-text-gray-700">
                        Project Name
                    </label>
                    <input
                        type="text"
                        value={localProjectName}
                        onChange={(e) => setLocalProjectName(e.target.value)}
                        placeholder="My New Circuit"
                        className="rf-px-3 rf-py-2 rf-border rf-border-gray-300 rf-rounded-lg focus:rf-ring-2 focus:rf-ring-blue-500 focus:rf-border-blue-500 rf-outline-none"
                        autoFocus
                    />
                    <div className="rf-flex rf-gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="rf-flex-1 rf-px-3 rf-py-2 rf-text-gray-600 hover:rf-bg-gray-100 rf-rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!localProjectName.trim()}
                            className="rf-flex-1 rf-px-3 rf-py-2 rf-bg-blue-600 rf-text-white rf-rounded-lg hover:rf-bg-blue-700 disabled:rf-opacity-50 disabled:rf-cursor-not-allowed"
                        >
                            Create
                        </button>
                    </div>
                </form>
            )}

            {projectState === "CREATING_PROJECT" && (
                <div className="rf-flex rf-flex-col rf-items-center rf-gap-3 rf-animate-pulse">
                    <div className="rf-text-lg">Creating project...</div>
                    <div className="rf-text-sm rf-text-gray-400">{localProjectName || projectName}</div>
                </div>
            )}

            {projectState === "AGENT_READY" && (
                <div className="rf-flex rf-flex-col rf-items-center rf-gap-3">
                    <div className="rf-text-green-600 rf-font-medium">Agent workspace ready.</div>
                    <div className="rf-text-sm rf-text-gray-500">Waiting for VHL...</div>
                </div>
            )}

            {(projectState === "VHL_READY" || projectState === "PROJECT_INITIALIZED") && (
                <div className="rf-flex rf-flex-col rf-items-center rf-gap-4 rf-w-full rf-max-w-[280px]">
                    <div className="rf-text-center">
                        <div className="rf-text-green-600 rf-font-medium rf-mb-1">VHL workspace ready.</div>
                        <div className="rf-text-xs rf-text-gray-400">Project: {projectName}</div>
                    </div>

                    <div className="rf-w-full rf-h-px rf-bg-gray-200" />

                    {isSynthesizable && (
                        <button
                            onClick={onSynthesize}
                            className="rf-w-full rf-px-4 rf-py-4 rf-bg-gradient-to-br rf-from-blue-600 rf-to-indigo-700 rf-text-white rf-rounded-2xl hover:rf-shadow-blue-200 hover:rf-shadow-xl rf-transition-all rf-flex rf-items-center rf-justify-center rf-gap-3 rf-group rf-border-none rf-cursor-pointer"
                        >
                            <span className="rf-text-xl group-hover:rf-scale-125 rf-transition-transform">🧠</span>
                            <div className="rf-flex rf-flex-col rf-items-start">
                                <span className="rf-font-bold rf-text-sm">Synthesize Circuit</span>
                                <span className="rf-text-[10px] rf-opacity-80">Start ANA Pipeline</span>
                            </div>
                        </button>
                    )}

                    <div className="rf-flex rf-flex-col rf-gap-2 rf-w-full">
                        <button className="rf-w-full rf-px-4 rf-py-2.5 rf-bg-white rf-border rf-border-gray-200 rf-text-gray-700 rf-rounded-xl hover:rf-bg-gray-50 hover:rf-border-gray-300 rf-transition-colors rf-flex rf-items-center rf-justify-center rf-gap-2 rf-text-xs">
                            <span>📄</span>
                            Upload Schematic
                        </button>
                        <button className="rf-w-full rf-px-4 rf-py-2.5 rf-bg-white rf-border rf-border-gray-200 rf-text-gray-700 rf-rounded-xl hover:rf-bg-gray-50 hover:rf-border-gray-300 rf-transition-colors rf-flex rf-items-center rf-justify-center rf-gap-2 rf-text-xs">
                            <span>📚</span>
                            Upload Datasheets
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
