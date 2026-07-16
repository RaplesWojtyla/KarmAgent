import { ScrollBoxRenderable } from "@opentui/core"
import { useMemo, useRef, useState, type RefObject } from "react"
import type { Command } from "./types"
import { getFilteredCommands } from "./filter-commands"
import { useKeyboard } from "@opentui/react"
import { useKeyboardLayer } from "../../providers/keyboard-layer"


type UseCommandMenuReturn = {
    showCommandMenu: boolean
    commandQuery: string
    selectedIndex: number
    scrollRef: RefObject<ScrollBoxRenderable | null>
    handleContentChange: (text: string) => void
    resolveCommand: (index: number) => Command | undefined
    setSelectedIndex: (index: number) => void
}


export function useCommandMenu(): UseCommandMenuReturn {
    const [textValue, setTextValue] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [showCommandMenu, setShowCommandMenu] = useState(false)
    const { push, pop, isTopLayer } = useKeyboardLayer()

    const scrollRef = useRef<ScrollBoxRenderable>(null)
    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : ""

    const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery])

    const handleContentChange = (text: string) => {
        setTextValue(text)
        setSelectedIndex(0)

        // Lompat ke command paling atas setiap kali user ngetik karakter baru
        const scrollBox = scrollRef.current
        if (scrollBox) {
            scrollBox.scrollTo(0)
        }

        const prefix = text.startsWith("/") ? text.slice(1) : null
        if (prefix !== null && !prefix.includes(" ")) {
            setShowCommandMenu(true)

            push("command-menu", () => {
                setShowCommandMenu(false)
                pop("command-menu")
                return true
            })
        } else {
            setShowCommandMenu(false)
            pop("command-menu")
        }
    }

    const resolveCommand = (index: number): Command | undefined => {
        const cmd = filteredCommands[index]
        if (cmd) {
            setShowCommandMenu(false)
            pop("command-menu")
        }

        return cmd
    }

    // Deteksi tombol panah atas dan bawah
    useKeyboard((key) => {
        if (!showCommandMenu || !isTopLayer("command-menu")) return

        if (key.name === "escape") {
            key.preventDefault()
            setShowCommandMenu(false)
            pop("command-menu")
        } else if (key.name === "up") {
            key.preventDefault()
            setSelectedIndex(prev => {
                const newIndex = Math.max(0, prev - 1)

                const sb = scrollRef.current
                if (sb && newIndex < sb.scrollTop) {
                    sb.scrollTo(newIndex)
                }

                return newIndex
            })
        } else if (key.name === "down") {
            key.preventDefault()
            setSelectedIndex(prev => {
                if (filteredCommands.length === 0) return 0

                const newIndex = Math.min(filteredCommands.length - 1, prev + 1)

                const sb = scrollRef.current
                if (sb) {
                    const viewportHeight = sb.viewport.height
                    const visibleEnd = sb.scrollTop + viewportHeight - 1

                    if (newIndex > visibleEnd) {
                        sb.scrollTo(newIndex - viewportHeight + 1)
                    }
                }

                return newIndex
            })
        }
    })

    return {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex
    }
}