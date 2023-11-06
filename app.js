require('dotenv').config()
const express = require('express')
const { Client } = require('pg')

const dbUser = process.env.DB_USER
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD) // mana#1995 -> mana%231995
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME

const client = new Client(
    `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
)

client.connect()
    .then(() => {
        client.query(`
            CREATE TABLE IF NOT EXISTS app_user_from_express (
                id serial PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `).then(() => {
            const app = express()
            const port = process.env.PORT

            app.get('/', (req, res) => {
                res.send("Hello world!")
            })

            app.listen(port, () => {
                console.log(`App is listening on port ${port}`)
            })
        })
    })