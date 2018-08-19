const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const app = express()

const port = 8080

const header = function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', '*')
    response.header('Access-Control-Allow-Headers', 'Authorization,Content-Type')
    next()
}

const options = function (request, response, next) {
    if (request.method === 'OPTIONS') {

        response.status(200)
        response.send()
        return
    }
    next()
}

app.use(header)
app.use(options)
app.use(express.json());

MongoClient.connect(db.url,{ useNewUrlParser: true }, (err, database) => {
    if (!err) {
        let db = database.db('app-db')
        require('./routes')(app, db)

        app.listen(port, () => {
            console.log('We are live on ' + port);
        })

    } else {
        console.log(err);
    }
})
