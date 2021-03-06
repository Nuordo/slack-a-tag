const { extractMentionedUser } = require('../utils/messageParser')

class ListByUserCommand {
  constructor (slack, tagsService) {
    this.slack = slack
    this.tagsService = tagsService

    this.init()
  }

  init () {
    this.slack.on('/list-by-user', async (msg, bot) => {
      try {
        const user = await extractMentionedUser(msg.text)
        if (!user) {
          bot.replyPrivate('Please provide a user to list tags for.')
          return
        }

        const data = await this.tagsService.getByUserId(msg.team_id, user.userId)
        const tags = []
        data.forEach((row) => {
          tags.push(row.tag)
        })

        bot.replyPrivate(`User ${user.userName} is tagged with: ${tags.join(', ')}`)
      } catch (error) {
        console.error(error)
        bot.replyPrivate('Whoops! An Error occured!')
      }
    })
  }
}

module.exports = ListByUserCommand
