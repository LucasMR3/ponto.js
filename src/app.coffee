crawl = require('./crawler')
config = require('./config')
mongoose = require('mongoose')
User = require('./models').User
Record = require('./models').Record
config = require('./config')

mongoose.Promise = require ('bluebird')
mongoose.connect config.DB_ADDR

findChanges = ->
  console.log '...listening for changes...'
  User.find({}).populate('log_history').exec (err, users)->
    if err
      console.error err
    else
      crawl config.ROUTER_IP, (routerStatus) ->
        for user in users
          for status in routerStatus
            if user.mac_address is status.mac_address
              ((user, status)-> #using this as a closure to copy the values.
                if user.log_history.length < 1
                  record = new Record({})
                  record.save().then ->
                    user.log_history.push record._id
                    return user.save()
                  .then ->
                    console.log 'created first record for user: ', user.nome, new Date()
                    return
                else
                  if user.log_history[user.log_history.length - 1].isLogged isnt status.isLogged
                    record = new Record({isLogged : status.isLogged})
                    record.save().then ->
                      user.log_history.push record._id
                      return user.save()
                    .then ->
                      console.log 'user ', user.nome, ' log status: ', status.isLogged
                      return
                return
                )(user, status)
        return
  return

setInterval ->
  findChanges()
  return
, config.INTERVAL
