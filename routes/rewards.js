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
                respnse.send({message: 'A recompensa informada não existe para ser deletada.'})
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