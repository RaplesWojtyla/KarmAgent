import { useCallback, useEffect, useRef } from "react"
import { useDialog } from "../../providers/dialog"
import { useTheme } from "../../providers/theme"
import { THEMES, type Theme } from "../../providers/theme/theme"
import { DialogSearchList } from "../dialog-search-list"


export const ThemeDialogContent = () => {
    const dialog = useDialog()
    const { currentTheme, setTheme } = useTheme()
    const originalThemeRef = useRef(currentTheme)
    const confirmedRef = useRef(false)

    useEffect(() => {
        return () => {
            if (!confirmedRef.current) {
                setTheme(originalThemeRef.current)
            }
        }
    }, [setTheme])

    const handleSelect = useCallback((theme: Theme) => {
        confirmedRef.current = true
        setTheme(theme)
        dialog.close()
    }, [setTheme, dialog])

    const handleHighlight = useCallback((theme: Theme) => {
        setTheme(theme)
    }, [setTheme])

    return (
        <DialogSearchList 
            items={THEMES}
            onSelect={handleSelect}
            onHighlight={handleHighlight}
            filterFn={(t, q)  => t.name.toLowerCase().includes(q.toLowerCase())}
            renderItem={(t, isSelected) =>  (
                <text 
                    selectable={false}
                    fg={isSelected ? "black" : "White"}
                >
                    {t.name === originalThemeRef.current.name ?
                        "\u0020\u2022\u0020" :
                        "\u0020\u0020\u0020"
                    }
                    {t.name}
                </text>
            )}
            getKey={(t) => t.name}
            placeholder="Search themes"
            emptyText="No matching themes"
        />
    )
}