module.exports = function(app, db) {
    app.post('/tasks', (request, response) => {
        db.collection('notes').insertOne(request.body, (err, results) => {
            if (err) {
                response.send({ 'error': 'An error has occurred' });
            } else {
                response.send(results);
            }
        })
    });
};