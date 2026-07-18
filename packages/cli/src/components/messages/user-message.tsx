import { useTheme } from "../../providers/theme"
import { SplitBorder } from "../border"


type Props = {
    message: string
}

export function UserMessage({ message }: Props) {
    const { colors } = useTheme()

    return (
        <box width={"100%"} alignItems="center">
            <box
                {...SplitBorder}
                borderColor={colors.primary}
                width={"100%"}
            >
                <box
                    justifyContent="center"
                    paddingX={2}
                    paddingY={1}
                    backgroundColor={colors.surface}
                    width={"100%"}
                >
                    <text>
                        {message}
                    </text>
                </box>
            </box>
        </box>
    )
}