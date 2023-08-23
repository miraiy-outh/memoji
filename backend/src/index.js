import express from 'express';
import sqlite3 from 'sqlite3'
import bodyParser from 'body-parser';
import { createResultsTable, deleteAllResults, dropTable, insertResults, selectAllResults } from './db-requests.js';

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const db_name = "./database/db.sqlite";

const runInit = false

const db = new sqlite3.Database(db_name, err => {

    if (err) {
        return console.error(err.message);
    }

    console.log("Successfull connection to the database");

    runInit && db.run(dropTable, (err) => {
        if (err) {
            console.log('Error', err);
        } else {
            db.run(createResultsTable, (err) => {
                if (err) {
                    console.log('Error', err);
                } else {
                    console.log('Successfuly init');
                }
            })
        }
    })


});

app.get('/', async (req, res) => {
    res.send('<h1> Home </h1>');
});

app.get('/results', async (req, res) => {

    db.all(selectAllResults, (err, data) => {
        if (err) {
            res.send({
                success: false,
                message: err.message
            });
        }
        else {
            res.send({
                success: true,
                data: data
            });
        }
    })

});

app.get('/results/clear-all', async (req, res) => {

    db.all(deleteAllResults, (err, data) => {
        if (err) {
            res.send({
                success: false,
                message: err.message
            });
        }
        else {
            res.send({
                success: true,
            });
        }
    })

});

app.post('/results', function (req, res) {
    if (!req.body) {
        res.send({
            success: false,
            message: "Empty body"
        })
        return;
    }

    const { name, score } = req.body

    if (!name || !score) {
        res.send({
            success: false,
            message: "Empty filds"
        })
    }

    db.all(insertResults(name, score), function (err, rows) {
        if (err) {
            res.send({
                success: false,
                message: err.message
            });
        }
        else {
            console.log(rows);
            res.send({
                success: true,
            });
        }
    })

})

app.listen(port, () => {
    console.log(`Server listening on port ${port} open http://localhost:8080`);
});