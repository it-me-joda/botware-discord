export interface DiscordBotInteraction {
	reply: (message: string) => Promise<void>
}

export interface DiscordBotCommand {
	name: string
	description: string
	action: (interaction: DiscordBotInteraction) => Promise<void>
}
