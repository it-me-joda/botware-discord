import { Client, REST, Routes } from 'discord.js'
import { DiscordBotCommand, DiscordBotInteraction } from './interfaces/command'
import { DiscordBotConfig } from './interfaces/config'

export async function startDiscordBot(
	commands: DiscordBotCommand[],
	config: DiscordBotConfig,
): Promise<void> {
	console.log('starting discord bot...')
	if (!config || !config.token || !config.clientId)
		throw new Error('config must provide TOKEN and CLIENT_ID')
	const commandMap = new Map<string, DiscordBotCommand>()
	commands.forEach((command) => {
		commandMap.set(command.name, command)
	})

	const rest = new REST().setToken(config.token)

	try {
		console.log('started refreshing / commands')

		await rest
			.put(Routes.applicationCommands(config.clientId), {
				body: Array.from(commands.values()).map((v) => {
					const result = Object.assign(
						{},
						v,
					) as Partial<DiscordBotCommand>
					delete result.action
					return result
				}),
			})
			.catch((reason) => {
				console.log(reason)
			})

		console.log('successfully reloaded / commands')
	} catch (error) {
		console.error(error)
	}

	const client = new Client({ intents: [] })

	client.on('ready', () => {
		if (client.user) console.log(`Logged in as ${client.user.tag}`)
	})

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		const t = interaction as unknown as DiscordBotInteraction

		const command = commandMap.get(interaction.commandName)
		if (command) await command.action(t)
		else
			await interaction.reply(
				`no command found for /${interaction.commandName}`,
			)
	})

	await client.login(config.token)
}
