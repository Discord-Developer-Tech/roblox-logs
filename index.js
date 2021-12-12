const key = "d9awm2ADl2mA0d329nAMl0ADo52jSDdoawGNxvZxuW4sUASCmgowA85"
const token = "ODEyODQ3MTc5OTA3MDcyMDAx.YDGs7Q.vCBs7zD7p1FaLOSsGy80Y85kes0"

async function run() {
    global.discordjs = require("discord.js")
    global.bodyparser = require("body-parser")
    global.express = require("express")

    global.api = global.express()
    global.client = new global.discordjs.Client({
        intents: [
            "GUILDS",
            "GUILD_VOICE_STATES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            "GUILD_MEMBERS",
            "GUILD_PRESENCES",
            "DIRECT_MESSAGES"
        ]
    })

    global.client.login(token)
    global.client.once("ready", () => console.log(`[DISCORD] Logged in ${global.client.user.tag}`))
    global.api.listen(process.env.PORT || 80, function(port) {
        console.log("[API] Listening")
    })
    global.api.use(global.bodyparser.json())

    global.api.get("/", (req,res) => {
        res.send("Listening for requests!")
    })
    global.api.post("/hooks/:guildId/:channelId", async function(req, res) {
        if (!req.body["key"]) {
            return res.json({
                success: false,
                reason: "There is no authentication key in the body"
            })
        }
        if (req.body["key"] !== key) {
            return res.json({
                success: false,
                reason: "Key not authorised"
            })
        }
        if (!req.params.channelId || !req.params.guildId) {
            return res.json({
                success: false,
                reason: "The channel ID or guild ID was not provided in the params"
            })
        }
        if (!global.client.guilds.cache.get(req.params.guildId)) {
            return res.json({
                success: false,
                reason: "I am not a member in the provided guild"
            })
        }
        if (!global.client.channels.cache.get(req.params.channelId)) {
            return res.json({
                success: false,
                reason: "I do not see the provided channel"
            })
        }

        const channel = global.client.channels.cache.get(req.params.channelId)
        await channel.send(req.body.data)

        res.json({
            success: true,
            reason: "Posted the embed"
        })
    })
}

module.exports = run()
