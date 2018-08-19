const noteRoutes = require('./note_routes')
const modelTasks = require('./model_tasks')
const rewards = require('./rewards')

module.exports = function(app, db) {
    noteRoutes(app, db)
    modelTasks(app, db)
    rewards(app,db)

    // Other route groups could go here, in the future
};