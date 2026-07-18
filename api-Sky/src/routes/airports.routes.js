import { Router } from 'express'
import { getAllAirports, getAirportById, createAirport, updateAirport, deleteAirport } from '../controllers/airports.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const airportsRouter = Router()

airportsRouter.get('/', getAllAirports)
airportsRouter.get('/:id', getAirportById)
airportsRouter.post('/', isAuth, createAirport)
airportsRouter.put('/:id', isAuth, updateAirport)
airportsRouter.delete('/:id', isAuth, deleteAirport)

export default airportsRouter
