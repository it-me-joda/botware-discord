import {
	CacheType,
	ChatInputCommandInteraction,
	Client,
	REST,
	Routes,
} from 'discord.js'
import 'dotenv/config'
import { Command } from './interfaces/command'

console.log('starting discord bot...')
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
if (!TOKEN || !CLIENT_ID) throw new Error('must provide TOKEN and CLIENT_ID')
;(async () => {
	const commands = new Map<string, Command>([
		[
			'ping',
			{
				name: 'ping',
				description: 'Replies with Pong!',
				action: async (
					interaction: ChatInputCommandInteraction<CacheType>,
				) => {
					await interaction.reply('Pong!')
				},
			},
		],
	])

	const rest = new REST().setToken(TOKEN)

	try {
		console.log('started refreshing / commands')

		await rest
			.put(Routes.applicationCommands(CLIENT_ID), {
				body: Array.from(commands.values()).map((v) => {
					const result = Object.assign({}, v) as Partial<Command>
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

		const command = commands.get(interaction.commandName)
		if (command) await command.action(interaction)
		else
			await interaction.reply(
				`no command found for /${interaction.commandName}`,
			)
	})

	await client.login(TOKEN)
})()
	.then((v) => console.log(v))
	.catch((r) => console.log(r))
