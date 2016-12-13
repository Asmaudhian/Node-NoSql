const Redis = require('ioredis')
const redis = new Redis ()

let logger = (key) => { return (val) => {
 console.log(`> ${key}:
`
, val)
 return val
}}

module.exports = {
  get: (userId) => {
    return redis.hget(`users:$(userId)`).then(logger('GET userId'))
  },

  count: () => {
    console.log('hello')
    return redis.hlen('user').then(logger('HLEN user'))
  },

  getAll: () => {
    // return redis.hgetall()
  },

  insert: (params) => {
      let pipeline = redis.pipeline()
      let userId = require('uuid').v4()

      pipeline.hmset(`users:$(userId)`, {
        pseudo: params.pseudo,
        email: params.email,
        firstname: params.firstname
      })
      pipeline.sadd('users', userId)
  },

  update: (userId, params) => {

  },

  remove: (userId) => {

  }
}
