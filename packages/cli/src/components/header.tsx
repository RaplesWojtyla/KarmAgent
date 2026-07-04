export function Header() {
    return (
        <box justifyContent="center" alignItems="center">
            <box flexDirection="row" justifyContent="center" gap={0.5} alignItems="center">
                <ascii-font font="tiny" text="Karm" color={"#FFFFFF"} />
                <ascii-font font="tiny" text="Agent" color={"#F59E0B"} />
            </box>
        </box>
    )
}