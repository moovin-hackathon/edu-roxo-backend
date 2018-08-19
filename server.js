const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const app = express()

const port = 8080

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
