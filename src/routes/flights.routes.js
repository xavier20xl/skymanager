import { Router } from 'express'
import { getAllFlights, getFlightById } from '../controllers/flights.controller.js'

const flightsRouter = Router()

flightsRouter.get('/', getAllFlights)
flightsRouter.get('/:id', getFlightById)

export default flightsRouter
