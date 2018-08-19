module.exports = function(app, db) {
 const crypto = require('crypto')

    app.post('/users', (request, response) => {
        const password = crypto.createHash('md5').update(request.body.password).digest('hex')
        db.collection('users').insertOne({ "email":request.body.email, "password": password },(err, results) => {
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
    });

};