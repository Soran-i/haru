const moment = require('moment-timezone')
const { Command } = require('../../core')

class ChannelInfo extends Command {
  constructor (...args) {
    super(...args, {
      name: 'channel',
      aliases: ['cinfo'],
      description: 'Displays information of a channel',
      usage: [{ name: 'member', type: 'channel', optional: true }],
      options: { guildOnly: true, localeKey: 'infocmd' }
    })
  }

  async handle ({ msg, args, client, settings }, responder) {
    let channel = msg.channel
    if (args.channel) {
      const [, idx] = await responder.selection(args.channel.map(m => m.name))
      if (typeof idx !== 'number') return
      channel = args.channel[idx]
    }

    return responder.embed({
      color: this.colours.blue,
      author: { name: responder.t('{{channel.title}}', { channel: '#' + channel.name }), icon_url: msg.guild.iconURL },
      fields: [
        { name: 'ID', value: channel.id, inline: true },
        { name: responder.t('{{channel.type}}'), value: responder.t(channel.type === 0 ? '{{channel.text}}' : '{{channel.voice}}'), inline: true },
        {
          name: responder.t('{{channel.createdOn}}'),
          value: moment(new Date(channel.createdAt)).tz(settings.tz).format('ddd Do MMM, YYYY [at] hh:mm:ss a')
        }
      ]
    }).send()
  }
}

module.exports = ChannelInfo
