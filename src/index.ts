import { CacheType, ChatInputCommandInteraction, Client, REST, Routes } from 'discord.js'
import 'dotenv/config'


console.log('starting discord bot...')
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
if (!TOKEN || !CLIENT_ID) throw new Error('must provide TOKEN and CLIENT_ID')

;(async () => {
    const commands = new Map<string, any>([
        [
            'ping', 
            {
                name: 'ping',
                description: 'Replies with Pong!',
                action: async (interaction: ChatInputCommandInteraction<CacheType>) => {interaction.reply('Pong!')}
            }
        ]
    ])

    const rest = new REST().setToken(TOKEN)
    
    try {
        console.log('started refreshing / commands')

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: Array.from(commands.values()).map(v => {const result = Object.assign({}, v); delete result.action; return result}) }).catch((reason) => {
            console.log(reason)
        })
    
        console.log('successfully reloaded / commands')
    } catch (error) {
        console.error(error)
    }
    
    const client = new Client({ intents: []})
    
    client.on('ready', () => {
        `Logged in as ${client.user!.tag}`
    })
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.get(interaction.commandName)
        if (command) command.action(interaction)
        else interaction.reply(`no command found for /${interaction.commandName}`)
    })
    
    client.login(TOKEN)
})()