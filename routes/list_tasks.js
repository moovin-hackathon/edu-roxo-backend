module.exports = function(app, db) {
    app.get('/list_tasks', (request, response,) => {

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
                                                points: listTask.points
                                            }
                                        }, (error, result) => {
                                            if (error) {
                                                response.status(503)
                                                response.send()
                                                return
                                            }

                                            response.send(listTask)
                                        })
                                    }
                                })
                            }
                        })
                    })
                } else {
                    response.send(dbListTask)
                }
            }
        )
    })
}