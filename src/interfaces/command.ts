import { CacheType, ChatInputCommandInteraction } from 'discord.js'

export interface Command {
	name: string
	description: string
	action: (
		interaction: ChatInputCommandInteraction<CacheType>,
	) => Promise<void>
}
