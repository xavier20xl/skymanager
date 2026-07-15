import express from 'express'
import dotenv from 'dotenv'
import flightsRouter from './src/routes/flights.routes.js'

dotenv.config()

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('API de SkyManager - Gestion de vuelos')
})

app.use('/flights', flightsRouter)

app.listen(PORT, () => {
    console.log(`Servidor en marcha en: http://localhost:${PORT}`)
})
