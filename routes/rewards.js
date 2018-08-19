const ObjectId = require('mongodb').ObjectId
module.exports = function (app, db) {
    app.get('/rewards', (request, response) => {
        db.collection('rewards').find({}).toArray((error, results) => {
            if (error) {
                response.status(503)
                response.send()
                return
            } else {
                response.send(results)
            }
        })
    })

    app.post('/rewards', (request, response) => {
        db.collection('rewards').insertOne(request.body, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            } else {
                response.status(201)
                response.send()
                return
            }
        })
    })

    app.post('/rewards/:id/:profileId', (request, response) => {
        
        db.collection('rewards').findOne({
            _id: ObjectId(request.params.id)
        }, (error, reward) => {
            if (error) {
                response.status(503)
                response.send()
                return
            }

            if (!reward) {
                response.status(422)
                response.send({message: 'A recompensa informada não existe para ser comprada.'})
                return
            }
            if (reward.status !== 'available') {
                response.status(422)
                response.send({message: 'Apenas recompensas disponíveis podem ser compradas.'})
                return
            }
            db.collection('profiles').findOne({
                _id: ObjectId(request.params.profileId)
            }, (error, profile) => {
                if (error) {
                    response.status(503)
                    response.send()
                    return
                }

                if (!profile) {
                    response.status(422)
                    response.send({message: 'O perfil informado não existe.'})
                    return
                }

                if (profile.type !== 'child') {
                    response.status(422)
                    response.send({message: 'O perfil informado deve ser um perfil de filho.'})
                    return
                }

                if (profile.points < reward.points) {
                    response.status(422)
                    response.send({message: 'Saldo insuficiente para realizar esta compra.'})
                    return
                }

                db.collection('profiles').findOneAndUpdate({
                    _id: profile._id
                }, {
                    $inc: {
                        points: reward.points * -1
                    }

                }, (err, results) => {
                    if (err) {
                        response.status(503)
                        response.send()
                        return
                    }

                    db.collection('rewards').findOneAndUpdate({
                        _id: reward._id
                    }, {
                        $set: {
                            status: 'bought',
                            child: profile.name
                        }

                    }, (err, results) => {
                        if (err) {
                            response.status(503)
                            response.send()
                            return
                        }

                        response.status(200)
                        response.send()
                        return
                    })
                })
            })
        })
    })

    app.delete('/rewards/:id', (request, response) => {
        db.collection('rewards').findOne({
            _id: ObjectId(request.params.id)
        }, (error, reward) => {
            if (error) {
                response.status(503)
                response.send()
                return
            }

            if (!reward) {
                response.status(422)
                response.send({message: 'A recompensa informada não existe para ser deletada.'})
                return
            }

            if (reward.status !== 'available') {
                response.status(422)
                response.send({message: 'Apenas recompensas disponíveis podem ser deletadas.'})
                return
            }

            db.collection('rewards').deleteOne({_id: reward._id}, (error, results) => {
                if (error) {
                    response.status(503)
                    response.send()
                    return
                }
                response.status(204)
                response.send()

            })
        })
    })
}