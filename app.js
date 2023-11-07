require('dotenv').config()
const express = require('express')
const { Client } = require('pg')
const { Liquid } = require('liquidjs')

const dbUser = process.env.DB_USER
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD) // mana#1995 -> mana%231995
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME

const client = new Client(
    `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
)
const engine = new Liquid()

client.connect()
    .then(() => {
        client.query(`
            CREATE TABLE IF NOT EXISTS deployments (
                id serial PRIMARY KEY,
                deployed_at TIMESTAMPTZ NOT NULL
            )
        `).then(() => {
            // Insert a new deployment record everytime the app is started
            client.query(`
                INSERT INTO deployments (id, deployed_at)
                VALUES (DEFAULT, NOW())
            `).then(() => console.log("Inserted a new deployment log successfully"))

            const app = express()
            app.engine('liquid', engine.express())
            app.set('views', './views')
            app.set('view engine', 'liquid')
            const port = process.env.PORT

            app.get('/', async (req, res) => {
                const result = await client.query(`
                    SELECT * FROM deployments ORDER BY deployed_at DESC LIMIT 10
                `)
                res.render('home', { deployments: result.rows })
            })

            app.listen(port, () => {
                console.log(`App is listening on port ${port}`)
            })
        })
    })