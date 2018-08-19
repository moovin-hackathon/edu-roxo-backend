module.exports = function(app, db) {
    const crypto = require('crypto')
    app.post('/login', (request, response) => {
        const password = crypto.createHash('md5').update(request.body.password).digest('hex')
        db.collection('users').findOne({
            "email": request.body.email, "password": password
        }, (error, results) => {
            if (error) {

                response.status(503)
                response.send()
                return
            }
             if(!results) {
                 response.status(401)
                 response.send()
                 return

             } else {
                 response.send(results)
             }

        });


    });

};