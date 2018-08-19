const ObjectId = require('mongodb').ObjectId

module.exports = function(app, db) {
    app.get('/list_tasks/:profileName?', (request, response,) => {

        const date = new Date().toISOString().substr(0, 10)

        db.collection('list_tasks').findOne(
            {
                date: date
            }, (error, dbListTask) => {
                if (error) {
                    response.status(503)
                    response.send()
                    return
                }

                if (!dbListTask) {
                    db.collection('model_tasks').find({
                        children: {$ne: []}
                    }).project({_id: 0}).toArray((error, modelTasks) => {
                        if (error) {
                            response.status(503)
                            response.send()
                            return
                        }

                        const listTask = {
                            tasks: modelTasks,
                            points: 100,
                            date: date
                        }

                        for (let i in listTask.tasks) {
                            const task = listTask.tasks[i]
                            task.status = 'pending'
                        }

                        db.collection('list_tasks').insertOne(listTask, (error, inserted) => {
                            if (error) {
                                response.status(503)
                                response.send()
                                return
                            }

                            if (inserted) {

                                db.collection('model_tasks').distinct('children', {
                                    children: {$ne: []}
                                }, (error, children) => {
                                    for (let i in children) {
                                        const child = children[i]

                                        db.collection('profiles').findOneAndUpdate({
                                            name: child
                                        }, {
                                            $inc: {
                                                points: parseInt(listTask.points)
                                            }
                                        })
                                    }

                                    if (request.params.profileName) {
                                        listTask.tasks = listTask.tasks.filter(task => task.children.indexOf(request.params.profileName) !== -1)
                                        response.send(listTask)
                                    } else {
                                        response.send(listTask)
                                    }
                                })
                            }
                        })
                    })
                } else {

                    if (request.params.profileName) {
                        dbListTask.tasks = dbListTask.tasks.filter(task => task.children.indexOf(request.params.profileName) !== -1)
                        response.send(dbListTask)
                    } else {
                        response.send(dbListTask)
                    }
                }
            }
        )
    })
    app.post('/list_tasks/:id', (request, response) => {

        const id = request.params.id
        const taskStatus = request.body.task.status
        const taskDescription = request.body.task.description
        const date = new Date().toISOString().substr(0, 10)

        db.collection('list_tasks').findOne({
            _id: ObjectId(id)
        }, (error, dbListTask) => {

            if (error) {
                response.status(503)
                response.send()
                return
            }

            if (!dbListTask) {
                response.status(404)
                response.send()
                return
            }

            if (dbListTask.date !== date) {
                response.status(422)
                response.send({message: 'A lista de tarefas deve ser de hoje para poder ser marcada como feita ou desfeita.'})
                return
            }

            if (taskStatus !== 'done' && taskStatus !== 'not_done') {
                response.status(422)
                response.send({message: 'A tarefa só pode ser marcada como finalizada ou não finalizada.'})
                return
            }

            const task = dbListTask.tasks.find(task => task.description == taskDescription)

            if (task.status !== 'pending') {
                response.status(422)
                response.send({message: 'A tarefa só pode ser marcada como finalizada ou não finalizada se estiver pendente.'})
                return
            }
            task.status = taskStatus

            db.collection('list_tasks').updateOne({_id: dbListTask._id}, {$set: {tasks: dbListTask.tasks}}, (error, updated) => {
                if (error) {
                    response.status(503)
                    response.send()
                    return
                }

                if (updated.modifiedCount) {

                    for (let i in task.children) {
                        const child = task.children[i]

                        db.collection('profiles').findOneAndUpdate({
                            name: child
                        }, {
                            $inc: {
                                points: parseInt(task.points)
                            }
                        })
                    }

                    response.status(204)
                    response.send()
                    return
                }
            })
        })
    })
}