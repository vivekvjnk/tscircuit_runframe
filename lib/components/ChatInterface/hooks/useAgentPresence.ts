import { useState, useCallback } from "react"

export const useAgentPresence = () => {
    const [isAgentConnected, setIsAgentConnected] = useState(false)

    const setConnected = useCallback((connected: boolean) => setIsAgentConnected(connected), [])

    return {
        isAgentConnected,
        setConnected
    }
}
