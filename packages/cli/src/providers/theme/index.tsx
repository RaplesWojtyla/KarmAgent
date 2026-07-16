import { homedir } from "node:os"
import { join } from "node:path"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { DEFAULT_THEME, THEMES, type Theme, type ThemeColors } from "./theme"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"


const CONFIG_DIR = join(homedir(), ".karmagent")
const THEME_PREFERENCES_PATH = join(CONFIG_DIR, "preferences.json")

type ThemePreferences = {
    themeName: string
}

function getInitialTheme(): Theme {
    try {
        const preferences = JSON.parse(
            readFileSync(THEME_PREFERENCES_PATH, "utf-8")
        ) as Partial<ThemePreferences>
        
        const savedTheme = THEMES.find(t => t.name === preferences.themeName)
        return savedTheme ?? DEFAULT_THEME
    } catch {
        return DEFAULT_THEME
    }
}

function persistTheme(theme: Theme) {
    try {
        mkdirSync(CONFIG_DIR, { recursive: true })
        writeFileSync(
            THEME_PREFERENCES_PATH,
            JSON.stringify({
                themeName: theme.name
            } satisfies ThemePreferences, null, 2),
            "utf-8"
        )
    } catch {
        // Ignore preference write failures so theme switching still works for this session
    }
}

export type ThemeContextValue = {
    colors: ThemeColors
    currentTheme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ThemeProviderProps = {
    children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme)

    const setTheme = useCallback((theme: Theme) => {
        setCurrentTheme(theme)
        persistTheme(theme)
    }, [])

    const value: ThemeContextValue = {
        colors: currentTheme.colors,
        currentTheme,
        setTheme
    }

    return (
        <ThemeContext.Provider value={value}>   
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const contextVal =  useContext(ThemeContext)
    if (!contextVal) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return contextVal
}