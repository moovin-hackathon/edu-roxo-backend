const ObjectId = require('mongodb').ObjectId

module.exports = function(app, db) {
    app.get('/rewards', (request, response) => {

        db.collection('rewards').find({}).toArray((error, results) => {
            if (error) {
                response.status(503)
                response.send()
                return
            } else {

                response.send(results)
            }
        });


    });

    app.post('/rewards', (request, response) => {
        db.collection('rewards').insertOne(request.body, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            } else {
                response.send(results);
            }
        })
    });

    app.delete('/rewards', (request, response) => {
        db.collection('rewards').deleteOne({_id: ObjectId(request.body.id)}, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            } else {
                response.status(204)
                response.send()
                return
            }
        })
    });

};