import React, { useState } from "react"
import type { ProjectUIState } from "../types"
import { cn } from "lib/utils"

interface ProjectInitializationMenuProps {
    projectState: ProjectUIState
    onCreateProject: (name: string) => void
    projectId: string | null
    projectName: string | null
}

export const ProjectInitializationMenu = ({
    projectState,
    onCreateProject,
    projectId,
    projectName
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
        <div className="rf-flex rf-flex-col rf-items-center rf-justify-center rf-h-full rf-p-4 rf-gap-4 rf-text-gray-600">
            {projectState === "NO_PROJECT" && !isCreating && (
                <div className="rf-flex rf-flex-col rf-gap-3 rf-w-full rf-max-w-[200px]">
                    <button
                        onClick={handleCreateClick}
                        className="rf-px-4 rf-py-2 rf-bg-blue-600 rf-text-white rf-rounded-lg hover:rf-bg-blue-700 rf-transition-colors rf-shadow-sm"
                    >
                        Create Project
                    </button>
                    <button
                        disabled
                        className="rf-px-4 rf-py-2 rf-bg-gray-100 rf-text-gray-400 rf-rounded-lg rf-cursor-not-allowed"
                    >
                        Open Project
                    </button>
                    <div className="rf-mt-4 rf-text-sm rf-text-gray-400 rf-text-center">
                        Recent Projects (None)
                    </div>
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
                <div className="rf-flex rf-flex-col rf-items-center rf-gap-4 rf-w-full rf-max-w-[240px]">
                    <div className="rf-text-center">
                        <div className="rf-text-green-600 rf-font-medium rf-mb-1">VHL workspace ready.</div>
                        <div className="rf-text-xs rf-text-gray-400">Project: {projectName}</div>
                    </div>

                    <div className="rf-w-full rf-h-px rf-bg-gray-200" />

                    <button className="rf-w-full rf-px-4 rf-py-2.5 rf-bg-white rf-border rf-border-gray-200 rf-text-gray-700 rf-rounded-lg hover:rf-bg-gray-50 hover:rf-border-gray-300 rf-transition-colors rf-flex rf-items-center rf-justify-center rf-gap-2">
                        <span>📄</span>
                        Upload Schematic
                    </button>
                    <button className="rf-w-full rf-px-4 rf-py-2.5 rf-bg-white rf-border rf-border-gray-200 rf-text-gray-700 rf-rounded-lg hover:rf-bg-gray-50 hover:rf-border-gray-300 rf-transition-colors rf-flex rf-items-center rf-justify-center rf-gap-2">
                        <span>📚</span>
                        Upload Datasheets
                    </button>
                </div>
            )}
        </div>
    )
}
