import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import type { DialogConfig } from "./types"
import { useKeyboardLayer } from "../keyboard-layer"
import { useKeyboard, useTerminalDimensions } from "@opentui/react"
import { RGBA, TextAttributes } from "@opentui/core"
import { useTheme } from "../theme"


export type DialogContextValue = {
    open: (config: DialogConfig) => void
    close: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

type DialogProviderProps = {
    children: ReactNode
}

export function DialogProvider({ children }: DialogProviderProps) {
    const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null)
    const { push, pop } = useKeyboardLayer()

    const close = useCallback(() => {
        setCurrentDialog(null)
        pop("dialog")
    }, [pop])

    const open = useCallback((config: DialogConfig) => {
        setCurrentDialog(config)
        push("dialog", () => {
            close()
            return true
        })
    }, [push, close])

    const value: DialogContextValue = {
        open,
        close
    }

    return (
        <DialogContext.Provider value={value}>
            { children }
            <Dialog currentDialog={currentDialog} close={close} />
        </DialogContext.Provider>
    )
}

export function useDialog(): DialogContextValue {
    const contextVal = useContext(DialogContext)
    if (!contextVal) {
        throw new Error("useDialog must be used within a DialogProvider")
    }

    return contextVal
}

type DialogProps = {
    currentDialog: DialogConfig | null
    close: () => void
}

function Dialog({ currentDialog, close }: DialogProps) {
    const { isTopLayer } = useKeyboardLayer()
    const { width, height } = useTerminalDimensions()
    const { colors } = useTheme()

    useKeyboard((k) => {
        if (!currentDialog || !isTopLayer("dialog")) return

        if (k.name === "escape") {
            close()
        }
    })

    if (!currentDialog) return null

    const { title, children } = currentDialog

    return (
        <box
            position="absolute"
            left={0}
            top={0}
            width={width}
            height={height}
            justifyContent="center"
            alignItems="center"
            backgroundColor={RGBA.fromInts(0, 0, 0, 150)}
            zIndex={100}
            onMouseDown={() => close()}
        >
            <box
                width={Math.min(60, width - 4)}
                height={"auto"}
                backgroundColor={colors.dialogSurface}
                paddingX={4}
                paddingY={1}
                flexDirection="column"
                gap={1}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <box
                    paddingBottom={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <text attributes={TextAttributes.BOLD}>
                        {title}
                    </text>
                    <text 
                        attributes={TextAttributes.DIM}
                        onMouseDown={() => close()}
                    >
                        esc
                    </text>
                </box>
                <box flexGrow={1}>
                    {children}
                </box>
            </box>
        </box>
    )
}