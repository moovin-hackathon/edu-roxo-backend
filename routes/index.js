const modelTasks = require('./model_tasks')
const rewards = require('./rewards')
const listTasks = require('./list_tasks')
const login = require('./login')
const users = require ('./users')

module.exports = function(app, db) {
    modelTasks(app, db)
    rewards(app,db)
    listTasks(app,db)
    login(app,db)
    users(app,db)

}