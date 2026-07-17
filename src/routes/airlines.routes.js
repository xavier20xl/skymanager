import { Router } from 'express'
import { getAllAirlines, getAirlineById, createAirline, updateAirline, deleteAirline } from '../controllers/airlines.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const airlinesRouter = Router()

airlinesRouter.get('/', getAllAirlines)
airlinesRouter.get('/:id', getAirlineById)
airlinesRouter.post('/', isAuth, createAirline)
airlinesRouter.put('/:id', isAuth, updateAirline)
airlinesRouter.delete('/:id', isAuth, deleteAirline)

export default airlinesRouter
