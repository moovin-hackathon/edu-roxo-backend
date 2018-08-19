const modelTasks = require('./model_tasks')
const rewards = require('./rewards')
const listTasks = require('./list_tasks')

module.exports = function(app, db) {
    modelTasks(app, db)
    rewards(app,db)
    listTasks(app,db)
}