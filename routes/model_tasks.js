const ObjectId = require('mongodb').ObjectId

module.exports = function(app, db) {
    app.get('/model_tasks', (request, response) => {

        db.collection('model_tasks').find({}).toArray((error, modelTasks) => {
            if (error) {
                response.status(503)
                response.send()
                return
            }

            if (!modelTasks) {
                response.status(404)
                response.send()
                return
            }
            response.send(modelTasks)
        })
    })

    app.post('/model_tasks', (request, response) => {
        const modelTask = request.body
        if(modelTask.children == undefined) {
            modelTask.children = []
        }
        db.collection('model_tasks').insertOne(modelTask, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            }

            if (!results) {
                response.status(400)
                response.send()
                return
            }
        })
    })

    app.delete('/model_tasks/:id', (request, response) => {
        const id = request.params.id

        db.collection('model_tasks').deleteOne({_id: ObjectId(id)}, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            }
            response.status(204)
            response.send()
        })
    })
}