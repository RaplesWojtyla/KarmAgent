import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { DEFAULT_DURATION, type ToastOptions, type ToastVariant } from "./types"
import { useTerminalDimensions } from "@opentui/react"
import { SplitBorder } from "../../components/border"
import { useTheme } from "../theme"


export type ToastContextValue = {
    show: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null)
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null)
    
    const clearCurrentTimeout = useCallback(() => {
        if (timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current)
            timeoutHandleRef.current = null
        }
    }, [])

    const show = useCallback((options: ToastOptions) => {
        const duration = options.duration || DEFAULT_DURATION

        clearCurrentTimeout()

        setCurrentToast({
            variant: options.variant || "info",
            ...options,
            duration
        })

        timeoutHandleRef.current = setTimeout(() => {
            setCurrentToast(null)
        }, duration).unref()
    }, [clearCurrentTimeout])

    const value: ToastContextValue = {
        show
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast currentToast={currentToast} />
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextValue {
    const contextVal = useContext(ToastContext)
    if (!contextVal) {
        throw new Error("useToast must be used within a Toast Provider")
    }

    return contextVal
}

type ToastProps = {
    currentToast: ToastOptions | null
}

function Toast({ currentToast }: ToastProps) {
    const { width } = useTerminalDimensions()
    const { colors } = useTheme()

    if (!currentToast) return null

    const varianColors: Record<ToastVariant, string> = {
        "success": colors.success,
        "error": colors.error,
        "info": colors.info,
    }

    const borderColor = currentToast.variant 
        ? varianColors[currentToast.variant]
        : varianColors.info

    return (
        <box
            position="absolute"
            justifyContent="center"
            alignItems="flex-start"
            top={2}
            right={2}
            width={Math.max(1, Math.min(60, width - 6))}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            backgroundColor={colors.surface}
            borderColor={borderColor}
            {...SplitBorder}
        >
            <box
                flexDirection="column"
                gap={1}
                width={"100%"}
            >
                <text fg={colors.primary} wrapMode={'word'} width={"100%"}>
                    {currentToast.message}
                </text>
            </box>
        </box>
    )
}
