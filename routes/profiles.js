const ObjectId = require('mongodb').ObjectId

module.exports = function(app, db) {
    app.get('/profiles/:id?', (request, response) => {

        if (request.params.id) {
            db.collection('profiles').findOne({_id: ObjectId(request.params.id)}, (error, profile) => {
                if (error) {
                    response.status(503)
                    response.send()
                    return
                }

                if (!profile) {
                    response.status(404)
                    response.send()
                    return
                }
                response.send(profile)
            })

            return
        }

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
        const profile = request.body
        profile.points = 0
        db.collection('profiles').insertOne(profile, (error, profiles) => {
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