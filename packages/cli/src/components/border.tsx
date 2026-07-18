export const EmptyBorder = {
    topLeft: "",
    bottomLeft: "",
    vertical: "",
    topRight: "",
    bottomRight: "",
    horizontal: " ",
    bottomT: "",
    topT: "",
    cross: "",
    leftT: "",
    rightT: "",
}

export const SplitBorder = {
    border: ["left" as const],
    customBorderChars: {
        ...EmptyBorder,
        vertical: "┃",
        bottomLeft: "╵"
    },
}
