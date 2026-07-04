export type CommandContext = {
    // new: () => void
    exit: () => void
}

export type Command = {
    name: string
    description: string
    value: string
    action?: (ctx: CommandContext) => void | Promise<void>
}