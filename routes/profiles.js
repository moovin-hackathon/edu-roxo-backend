const ObjectId = require('mongodb').ObjectId

module.exports = function(app, db) {
    app.get('/profiles', (request, response) => {
        db.collection('profiles').find({}).toArray((error, profiles) => {
            if (error) {
                response.status(503)
                response.send()
                return
            }

            if (!profiles) {
                response.status(404)
                response.send()
                return
            }
            response.send(profiles)
        })
    })

    app.post('/profiles', (request, response) => {
        db.collection('profiles').insertOne(request.body, (error, profiles) => {
            if (error) {
                response.status(503)
                response.send()
                return
            }
                response.status(201)
                response.send()
                return
        })
    })

    app.delete('/profiles/:id', (request, response) => {
        const id = request.params.id

        db.collection('profiles').deleteOne({_id: ObjectId(id)}, (err, results) => {
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