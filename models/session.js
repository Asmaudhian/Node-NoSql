const Redis = require('ioredis')
const redis = new Redis ()


module.exports = {
  get: (userId) => {
    return redis.hget(`users:$(userId)`)
  },

  insert: (userId, accessToken) => {
      let expiresTime = new Date()

      return redis.hmset(`session:$(accessToken)`, {
        userId, accessToken, createdAt:Date.now(), expiresAt:expiresTime.setHours(expiresTime.getHours() + 3)
      }, function(error, results){})
  }
}
