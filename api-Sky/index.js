import express from 'express'
import dotenv from 'dotenv/config'
import flightsRouter from './src/routes/flights.routes.js'
import airlinesRouter from './src/routes/airlines.routes.js'
import airportsRouter from './src/routes/airports.routes.js'
import passengersRouter from './src/routes/passengers.routes.js'
import bookingsRouter from './src/routes/bookings.routes.js'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('API de SkyManager - Gestion de vuelos')
})

app.use('/flights', flightsRouter)
app.use('/airlines', airlinesRouter)
app.use('/airports', airportsRouter)
app.use('/passengers', passengersRouter)
app.use('/bookings', bookingsRouter)

app.listen(PORT, () => {
    console.log(`Servidor en marcha en: http://localhost:${PORT}`)
})
