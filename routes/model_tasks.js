module.exports = function(app, db) {
    app.get('/model_tasks', (request, response) => {

        db.collection('model_tasks').find({}).toArray((error, results) => {
            if (error) {
                response.status(503)
                response.send()
                return
            } else {

                response.send(results)
            }
        });


    });

    app.post('/model_tasks', (request, response) => {
        db.collection('model_tasks').insertOne(request.body, (err, results) => {
            if (err) {
                response.status(503)
                response.send()
                return
            } else {
                response.send(results);
            }
        })
    });
};