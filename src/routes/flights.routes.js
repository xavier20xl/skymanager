import { Router } from 'express'
import { getAllFlights, getFlightById, createFlight, updateFlight, deleteFlight } from '../controllers/flights.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const flightsRouter = Router()

flightsRouter.get('/', getAllFlights)
flightsRouter.get('/:id', getFlightById)
flightsRouter.post('/', isAuth, createFlight)
flightsRouter.put('/:id', isAuth, updateFlight)
flightsRouter.delete('/:id', isAuth, deleteFlight)

export default flightsRouter
